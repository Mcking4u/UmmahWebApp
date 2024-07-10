import withNavUpdate from "../../wrappers/with_nav_update";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import NetworkHandler, { host } from "../../../network/network_handler";
import { Add, Approval, Category, Close, Edit } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const approvalEndpoint = "/dawaah/api/validate-DawaahValidation";
const categoryEndpoint = "/dawaah/api/getcategory";
const addCategoryEndpoint = "/dawaah/api/addcategory";
const editCategoryEndpoint = "/dawaah/api/editcategory";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const dawaahs = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      const approvals = await new NetworkHandler().getPendingApprovalsAdmin(
        approvalEndpoint
      );
      setPendingApprovals(approvals);
    };

    const fetchCategories = async () => {
      const categoriesData = await new NetworkHandler().getCategoryAdmin(
        categoryEndpoint
      );
      setCategories(categoriesData);
    };

    fetchPendingApprovals();
    fetchCategories();
  }, []);

  const handleApprove = async (id) => {
    await new NetworkHandler().approveApprovalsAdmin(approvalEndpoint, id);
    // Refresh the data
    const approvals = await new NetworkHandler().getPendingApprovalsAdmin(
      approvalEndpoint
    );
    setPendingApprovals(approvals);
  };

  const handleOpenDialog = (category = null) => {
    setIsEditMode(!!category);
    if (category) {
      setCategoryName(category.dawaah_type);
      setSelectedCategoryId(category.id);
      setFileName(category.type_image);
      setCategoryImage(category.type_image);
    } else {
      setCategoryName("");
      setCategoryImage("");
      setFileName("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategoryName("");
    setCategoryImage("");
    setFileName("");
    setSelectedCategoryId("");
    setFormError("");
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryImageChange = async (e) => {
    const file = e.target.files[0];
    setFileName(file?.name || "");
    const base64 = await convertToBase64(file);
    setCategoryImage(base64);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = function () {
        let base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        resolve(base64String);
      };
    });
  };

  const handleSubmit = async () => {
    if(categoryName === ""){
        setFormError("Category name is required");
        return;
    }
    setLoading(true);
    if (isEditMode) {
      await new NetworkHandler().editCategoryAdmin(
        editCategoryEndpoint,
        selectedCategoryId,
        categoryName,
        categoryImage
      );
    } else {
      await new NetworkHandler().addCategoryAdmin(
        addCategoryEndpoint,
        categoryName,
        categoryImage
      );
    }
    const categoriesData = await new NetworkHandler().getCategoryAdmin(
      categoryEndpoint
    );
    setCategories(categoriesData);
    setLoading(false);
    handleCloseDialog();
  };

  const pendingApprovalColumns = [
    { field: "hosted_by", headerName: "Host", width: 150, flex: 1 },
    { field: "topic", headerName: "Topic", width: 150, flex: 1 },
    { field: "description", headerName: "Description", width: 200, flex: 1 },
    { field: "dawaah_type", headerName: "Type", width: 150, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<Approval />}
          variant="contained"
          color="primary"
          onClick={() => handleApprove(params.id)}
        >
          Approve
        </Button>
      ),
    },
  ];

  const categoryColumns = [
    {
      field: "dawaah_type",
      headerName: "Category Name",
      width: 200,
      flex: 1,
    },
    {
      field: "type_image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={`${host}${params.value}`}
          alt="Category"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<Edit />}
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <h2>Pending Approvals</h2>
      <div style={{ height: 250, width: "100%" }}>
        <DataGrid rows={pendingApprovals} columns={pendingApprovalColumns} />
      </div>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Categories</h2>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          color="primary"
          style={{ marginLeft: 20 }}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={categories} columns={categoryColumns} />
      </div>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {isEditMode ? "Edit Category" : "Add Category"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="Category Name"
            size="small"
            type="text"
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                   
                      <Category />
                  </InputAdornment>
                ),
              }}
            error={error !== ""}
            helperText={error}
            fullWidth
            value={categoryName}
            onChange={handleCategoryNameChange}
            required
          />
          <Box sx={{ width: "100%", mt: 2 }}>
            <Button component="label" variant="outlined" fullWidth>
              Choose Category Image
              <VisuallyHiddenInput
                margin="dense"
                id="categoryImage"
                label="Category Image"
                type="file"
                fullWidth
                onChange={handleCategoryImageChange}
                required={!isEditMode}
              />
            </Button>
          </Box>
          <Typography sx={{ width: "100%" }}>{fileName}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary"
          disabled={loading}
          >
            {isEditMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default withNavUpdate(dawaahs);
