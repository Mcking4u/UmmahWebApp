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
  Rating,
  Slide,
  TextField,
  Typography,
  styled,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import NetworkHandler, { host } from "../../../network/network_handler";
import { Add, Category, Close, Edit, Upload } from "@mui/icons-material";

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

const addCategoryEndpoint = "/dawaah/api/addcategory";
const editCategoryEndpoint = "/dawaah/api/editcategory";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UmrahAndHajj = () => {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    contactNumber: "",
    companyName: "",
    description: "",
    state: "",
    country: "",
    completeAddress: "",
    facebookURL: "",
    instagramURL: "",
    websiteURL: "",
    logoFile: "",
    logoFileName: "",
    thumbnailFile: "",
    thumbnailFileName: "",
    rating: 0,
    umrah: false,
    hajj: false,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await new NetworkHandler().getUmrahAndHajj();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleOpenDialog = (category = null) => {
    setIsEditMode(!!category);
    if (category) {
      setFormData({
        contactNumber: category.contact_number,
        companyName: category.name,
        description: category.description,
        state: category.state,
        country: category.country,
        completeAddress: category.complete_location,
        facebookURL: category.facebook,
        instagramURL: category.instagram,
        websiteURL: category.Website,
        logoFile: category.logo,
        logoFileName: category.logo.split("/").pop(),
        thumbnailFile: category.thumbnail,
        thumbnailFileName: category.thumbnail.split("/").pop(),
        rating: parseFloat(category.rating_star),
        umrah: category.Umrah,
        hajj: category.hajj,
      });
      setSelectedCategoryId(category.id);
    } else {
      setFormData({
        contactNumber: "",
        companyName: "",
        description: "",
        state: "",
        country: "",
        completeAddress: "",
        facebookURL: "",
        instagramURL: "",
        websiteURL: "",
        logoFile: "",
        logoFileName: "",
        thumbnailFile: "",
        thumbnailFileName: "",
        rating: 0,
        umrah: false,
        hajj: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      contactNumber: "",
      companyName: "",
      description: "",
      state: "",
      country: "",
      completeAddress: "",
      facebookURL: "",
      instagramURL: "",
      websiteURL: "",
      logoFile: "",
      logoFileName: "",
      thumbnailFile: "",
      thumbnailFileName: "",
      rating: 0,
      umrah: false,
      hajj: false,
    });
    setSelectedCategoryId(null);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    const fileName = file?.name || "";
    const base64 = await convertToBase64(file);
    setFormData({
      ...formData,
      [field]: base64,
      [`${field}Name`]: fileName,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = () => {
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        resolve(base64String);
      };
    });
  };

  const handleSubmit = async () => {
    if (formData.companyName === "") {
      setFormError("Company name is required");
      return;
    }
    setLoading(true);
    const categoryData = {
      ...formData,
      contact_number: formData.contactNumber,
      name: formData.companyName,
      complete_location: formData.completeAddress,
      facebook: formData.facebookURL,
      instagram: formData.instagramURL,
      Website: formData.websiteURL,
      rating_star: formData.rating,
      logo: formData.logoFile,
      thumbnail: formData.thumbnailFile,
      Umrah: formData.umrah,
      hajj: formData.hajj,
    };

    if (isEditMode) {
    //   await new NetworkHandler().editCategoryAdmin(
    //     editCategoryEndpoint,
    //     selectedCategoryId,
    //     categoryData
    //   );
    } else {
      await new NetworkHandler().addVendorAdmin(
        categoryData
      );
    }
    const categoriesData = await new NetworkHandler().getUmrahAndHajj();
    setCategories(categoriesData);
    setLoading(false);
    handleCloseDialog();
  };

  const categoryColumns = [
    {
      field: "name",
      headerName: "Company Name",
      width: 200,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      flex: 1,
    },
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      renderCell: (params) => (
        <img
          src={`${host}${params.row.logo}`}
          alt="Category"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      field: "thumbnail",
      headerName: "Thumbnail",
      width: 100,
      renderCell: (params) => (
        <img
          src={`${host}${params.row.thumbnail}`}
          alt="Category"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      field: "complete_location",
      headerName: "Address",
      width: 200,
      flex: 1,
    },
    {
      field: "rating_star",
      headerName: "Rating",
      flex: 1,
      width: 200,
      renderCell: (params) => (
        <Rating value={parseFloat(params.row.rating_star)} readOnly />
      ),
    },
    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   width: 100,
    //   renderCell: (params) => (
    //     <Button
    //       size="small"
    //       startIcon={<Edit />}
    //       variant="contained"
    //       color="secondary"
    //       onClick={() => handleOpenDialog(params.row)}
    //     >
    //       Edit
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          mb: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2></h2>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          color="primary"
          style={{ marginLeft: 20 }}
          onClick={() => handleOpenDialog()}
        >
          Add Vendor
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
          {isEditMode ? "Edit Vendor" : "Add Vendor"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300, maxWidth:300 }}>
          <TextField
            autoFocus
            margin="dense"
            id="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            variant="standard"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+</InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="companyName"
            label="Company Name"
            type="text"
            fullWidth
            variant="standard"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="state"
            label="State"
            type="text"
            fullWidth
            variant="standard"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="country"
            label="Country"
            type="text"
            fullWidth
            variant="standard"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="completeAddress"
            label="Complete Address"
            type="text"
            fullWidth
            variant="standard"
            name="completeAddress"
            value={formData.completeAddress}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="facebookURL"
            label="Facebook URL"
            type="text"
            fullWidth
            variant="standard"
            name="facebookURL"
            value={formData.facebookURL}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="instagramURL"
            label="Instagram URL"
            type="text"
            fullWidth
            variant="standard"
            name="instagramURL"
            value={formData.instagramURL}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="websiteURL"
            label="Website URL"
            type="text"
            fullWidth
            variant="standard"
            name="websiteURL"
            value={formData.websiteURL}
            onChange={handleInputChange}
          />
          <Box mt={2} mb={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              fullWidth
              color="primary"
            >
              Upload Logo
              <VisuallyHiddenInput
                type="file"
                name="logoFile"
                onChange={(e) => handleFileChange(e, "logoFile")}
                accept="image/*"
              />
            </Button>
            {formData.logoFileName && (
              <Typography variant="body2">{formData.logoFileName}</Typography>
            )}
          </Box>
          <Box mt={2} mb={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              fullWidth
              color="primary"
            >
              Upload Thumbnail
              <VisuallyHiddenInput
                type="file"
                name="thumbnailFile"
                onChange={(e) => handleFileChange(e, "thumbnailFile")}
                accept="image/*"
              />
            </Button>
            {formData.thumbnailFileName && (
              <Typography variant="body2">
                {formData.thumbnailFileName}
              </Typography>
            )}
          </Box>
          <Box mt={2} mb={2}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={(e, newValue) =>
                handleInputChange({
                  target: { name: "rating", value: newValue },
                })
              }
            />
          </Box>
          <Box mt={2} mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.umrah}
                  onChange={handleInputChange}
                  name="umrah"
                  color="primary"
                />
              }
              label="Umrah"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hajj}
                  onChange={handleInputChange}
                  name="hajj"
                  color="primary"
                />
              }
              label="Hajj"
            />
          </Box>
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default withNavUpdate(UmrahAndHajj);
