import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Grid,
  CircularProgress,
  Box,
  InputAdornment,
} from "@mui/material";
import { Add, Phone, Email, LocationOn, Lock, Home, Flag, MarkunreadMailbox, Edit, Person, Map } from "@mui/icons-material";
import withNavUpdate from "../../wrappers/with_nav_update";
import NetworkHandler from "../../../network/network_handler";


const Masjids = () => {
  const [masjidData, setMasjidData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address_street: "",
    address_city: "",
    address_state: "",
    address_country: "",
    address_postal_code: "",
    latitude: "",
    longitude: "",
    phone_number: "",
    email_address: "",
    thumbnail_url: "",
    Password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchMasjidData = async () => {
      setLoading(true);
      try {
        const response = await new NetworkHandler().getMasjidAdmin();
        setMasjidData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasjidData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.address_street) errors.address_street = "Street address is required";
    if (!formData.address_city) errors.address_city = "City is required";
    if (!formData.address_state) errors.address_state = "State is required";
    if (!formData.address_country) errors.address_country = "Country is required";
    if (!formData.address_postal_code) errors.address_postal_code = "Postal code is required";
    if (!formData.latitude || isNaN(formData.latitude)) errors.latitude = "Valid latitude is required";
    if (!formData.longitude || isNaN(formData.longitude)) errors.longitude = "Valid longitude is required";
    if (!formData.phone_number) errors.phone_number = "Phone number is required";
    if (!formData.email_address || !/\S+@\S+\.\S+/.test(formData.email_address)) errors.email_address = "Valid email address is required";
    if (!formData.thumbnail_url || !/^https?:\/\/.+\..+/.test(formData.thumbnail_url)) errors.thumbnail_url = "Valid thumbnail URL is required";
    if(!isEditMode){
    if (!formData.Password) errors.Password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogOpen = () => {
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      address_street: "",
      address_city: "",
      address_state: "",
      address_country: "",
      address_postal_code: "",
      latitude: "",
      longitude: "",
      phone_number: "",
      email_address: "",
      thumbnail_url: "",
      Password: "",
    });
  };

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (isEditMode) {
        await new NetworkHandler().editMasjidAdmin(formData);
      } else {
        await new NetworkHandler().addMasjidAdmin(formData);
      }
      handleDialogClose();
      const response = await new NetworkHandler().getMasjidAdmin();
      setMasjidData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };


const columns = [
    { field: "name", headerName: "Masjid Name", width: 200, flex: 1 },
    {
      field: "thumbnail_url",
      headerName: "Thumbnail Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Masjid Thumbnail"
          style={{
            borderRadius: "10px",
            width: "50px",
            height: "50px",
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "phone_number", headerName: "Phone Number", width: 150, flex: 1 },
    { field: "email_address", headerName: "Email Address", width: 200, flex: 1 },
    { field: "address_street", headerName: "Address", width: 300, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          startIcon={<Edit />}
          variant="contained"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleEditClick = (data) => {
    data.Password ="";
    setFormData(data);

    setIsEditMode(true);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box sx={{ height: 400, width: "100%" }}>
        <Box sx={{ width: "100%", textAlign: "right", mb: 1 }}>
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            onClick={handleDialogOpen}
          >
            Add Masjid
          </Button>
        </Box>
        <DataGrid
          rows={masjidData}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        TransitionComponent={Slide}
      >
        <DialogTitle sx={{ mb: 0, pb: 0 }}>{isEditMode ? "Edit Masjid" : "Add Masjid"}</DialogTitle>
        <DialogContent>
          <Grid sx={{ mt: 0.5 }} container spacing={2}>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Address Street"
                name="address_street"
                value={formData.address_street}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.address_street}
                helperText={formErrors.address_street}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Address City"
                name="address_city"
                value={formData.address_city}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.address_city}
                helperText={formErrors.address_city}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Flag />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Address State"
                name="address_state"
                value={formData.address_state}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.address_state}
                helperText={formErrors.address_state}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Flag />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Address Country"
                name="address_country"
                value={formData.address_country}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.address_country}
                helperText={formErrors.address_country}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Flag />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Address Postal Code"
                name="address_postal_code"
                value={formData.address_postal_code}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.address_postal_code}
                helperText={formErrors.address_postal_code}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MarkunreadMailbox />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleFormChange}
                fullWidth
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Map />
                      </InputAdornment>
                    ),
                  }}
                error={!!formErrors.latitude}
                helperText={formErrors.latitude}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.longitude}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Map />
                      </InputAdornment>
                    ),
                  }}
                helperText={formErrors.longitude}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Email Address"
                name="email_address"
                value={formData.email_address}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.email_address}
                helperText={formErrors.email_address}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Thumbnail URL"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.thumbnail_url}
                helperText={formErrors.thumbnail_url}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Password"
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.Password}
                helperText={formErrors.Password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {submitting ? "Saving..." : isEditMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(Masjids);
