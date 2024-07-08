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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  CircularProgress,
  Box,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import withNavUpdate from "../../wrappers/with_nav_update";
import NetworkHandler from "../../../network/network_handler";
import { Add, BatchPrediction, Description, Map, Money, Title } from "@mui/icons-material";

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
    fee: "",
    address: "",
    batches: [],
    newBatch: "", // For adding new batches
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
    if (!formData.fee.trim() || isNaN(formData.fee)) {
      errors.fee = "Fee cannot be empty and should be a number";
    }
    if (!formData.address.trim()) {
      errors.address = "Address cannot be empty";
    }
    if (!formData.description.trim()) {
      errors.description = "Description cannot be empty";
    }
    if (formData.batches.length === 0) {
      errors.batches = "There must be at least one batch";
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
        fee: "",
        address: "",
        batches: [],
        newBatch: "",
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
        fee: "",
        address: "",
        batches: [],
        newBatch: "",
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

  const handleAddBatch = () => {
    if (formData.newBatch.trim() !== "") {
      setFormData({
        ...formData,
        batches: [...formData.batches, { service: formData.newBatch }],
        newBatch: "",
      });
    }
  };

  const handleBatchDelete = (index) => {
    const newBatches = [...formData.batches];
    newBatches.splice(index, 1);
    setFormData({ ...formData, batches: newBatches });
  };

  const handleEditClick = (rowData) => {
    setFormData({
      madrasa_name: rowData.name,
      description: rowData.describtion,
      fee: rowData.fee,
      address: rowData.address,
      batches: rowData.batches.map((batch) => ({ service: batch.batch })),
      newBatch: "",
    });
    setEditId(rowData.id);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const columns = [
    { field: "name", headerName: "Madrasa Name", width: 200, flex: 1 },
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
              fee: "",
              address: "",
              batches: [],
              newBatch: "",
            });
            setLoading(false);
            setIsEditing(false);
            setEditId(null);
            setFormErrors({});
            setOpenDialog(true);
          }}
          sx={{ marginBottom: 2 }} // Add some spacing below the button
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

        <DialogContent sx={{maxWidth:350}}>
          <Stack>
            <Grid sx={{ mt: 1 }} container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Madrasa Fee"
                  fullWidth
                  value={formData.fee}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                          <Money />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: e.target.value })
                  }
                  error={!!formErrors.fee}
                  helperText={formErrors.fee}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                          <Description />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>

            <Grid
              sx={{ mt: 1, mb: 1 }}
              container
              spacing={2}
              alignItems="center"
            >
              <Grid item xs={8}>
                <TextField
                  label="Add Batch"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                          <BatchPrediction />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.newBatch}
                  onChange={(e) =>
                    setFormData({ ...formData, newBatch: e.target.value })
                  }
                  helperText={formErrors.batches}
                />
              </Grid>
              <Grid item xs={4}>
                <Button 
                variant="outlined" onClick={handleAddBatch}>
                  Add
                </Button>
              </Grid>
            </Grid>

            <List sx={{ mb: 1 }}>
              {formData.batches.map((batch, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleBatchDelete(index)}
                      sx={{ color: "red" }} // Change delete icon color to red
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ border: "1px solid #e0e0e0", mb: 1 }} // Add border and bottom margin
                >
                  <ListItemText primary={batch.service} />
                </ListItem>
              ))}
            </List>
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
            {isEditing ? "Update Madrasa" : "Add Madrasa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withNavUpdate(MyMadrasas);
