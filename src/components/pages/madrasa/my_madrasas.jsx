import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Slide,
  Stack,
  Grid,
  CircularProgress,
  Box,
  IconButton,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import withNavUpdate from "../../wrappers/with_nav_update";
import NetworkHandler from "../../../network/network_handler";
import { Money, Map, Title } from "@mui/icons-material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function MyMadrasas() {
  const [madrasasData, setMadrasasData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    madrasa_name: "",
    description: "",

    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  async function fetchData() {
    try {
      const response = await new NetworkHandler().getMadrasas();
      setMadrasasData(response.madrasas);
    } catch (error) {
      console.error("Error fetching madrasas:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.madrasa_name.trim()) {
      errors.madrasa_name = "Madrasa Name cannot be empty";
    }

    if (!formData.address.trim()) {
      errors.address = "Address cannot be empty";
    }
    if (!formData.description.trim()) {
      errors.description = "Description cannot be empty";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMadrasa = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await new NetworkHandler().addMadrasa(formData);
      setOpenDialog(false);
      setFormData({
        madrasa_name: "",
        description: "",
        address: "",
      });
      setFormErrors({});
      fetchData();
    } catch (error) {
      console.error("Error adding madrasa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMadrasa = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await new NetworkHandler().editMadrasa({ ...formData, edit_id: editId });
      setOpenDialog(false);
      setFormData({
        madrasa_name: "",
        description: "",
        address: "",
      });
      setFormErrors({});
      fetchData();
    } catch (error) {
      console.error("Error editing madrasa:", error);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleEditClick = (rowData) => {
    setFormData({
      madrasa_name: rowData.name,
      description: rowData.describtion,
      address: rowData.address,
    });
    setEditId(rowData.id);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const columns = [
    { field: "name", headerName: "Madrasa Name", width: 200, flex: 1, minWidth: 150 },
    { field: "describtion", headerName: "Description", width: 300, flex: 2 },
    { field: "address", headerName: "Address", width: 150, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({
              madrasa_name: "",
              description: "",
              address: "",
            });
            setLoading(false);
            setIsEditing(false);
            setEditId(null);
            setFormErrors({});
            setOpenDialog(true);
          }}
          sx={{ marginBottom: 2 }}
        >
          Add Madrasa
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={madrasasData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {isEditing ? "Edit Madrasa" : "Add Madrasa"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{ minHeight: '400px' }}
        >
          <Stack spacing={2}
            sx={{ mt: 1 }}
          >
            <TextField
              label="Madrasa Name"
              fullWidth

              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Title />
                  </InputAdornment>
                ),
              }}
              value={formData.madrasa_name}
              onChange={(e) =>
                setFormData({ ...formData, madrasa_name: e.target.value })
              }
              error={!!formErrors.madrasa_name}
              helperText={formErrors.madrasa_name}
            />
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={2}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Map />
                  </InputAdornment>
                ),
              }}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              error={!!formErrors.address}
              helperText={formErrors.address}
            />

            <ReactQuill
              theme="snow"

              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter description..."
              style={{ marginTop: 16, height: "200px" }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isEditing ? handleEditMadrasa : handleAddMadrasa}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            color="primary"
          >
            {isEditing ? "Save Madrasa" : "Add Madrasa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withNavUpdate(MyMadrasas);
