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
  IconButton,
} from "@mui/material";
import { Add, Person, Email, Lock, Close, Replay } from "@mui/icons-material";
import withNavUpdate from "../../wrappers/with_nav_update";
import NetworkHandler from "../../../network/network_handler";

const Accounts = () => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    password: "",
    accountId: null,
  });
  const [resetPasswordError, setResetPasswordError] = React.useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await new NetworkHandler().getAccountsAdmin();
        setAccountData(response.accounts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.fullname) errors.fullname = "Full name is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      username: "",
      email: "",
      fullname: "",
      password: "",
    });
    setFormErrors({});
  };

  const handleResetPasswordDialogOpen = (accountId) => {
    setResetPasswordDialogOpen(true);
    setResetPasswordData({ ...resetPasswordData, accountId });
  };

  const handleResetPasswordDialogClose = () => {
    setResetPasswordDialogOpen(false);
    setResetPasswordData({
      password: "",
      accountId: null,
    });
    setResetPasswordError("");
  };


  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleResetPasswordFormChange = (event) => {
    setResetPasswordData({
      ...resetPasswordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await new NetworkHandler().addAccountAdmin(formData);
      handleDialogClose();
      const response = await new NetworkHandler().getAccountsAdmin();
      setAccountData(response.accounts);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const validateResetForm = () => {
    const errors = {};
    if (!resetPasswordData.password) errors.password = "Password is required";
    setResetPasswordError(errors.password ? errors.password : "")
    return Object.keys(errors).length === 0;
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    if (!validateResetForm()) return;

    setSubmitting(true);
    try {
      await new NetworkHandler().resetAccountPasswordAdmin(
        resetPasswordData.password,
        resetPasswordData.accountId
      );
      handleResetPasswordDialogClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { field: "username", headerName: "Username", width: 150, flex: 1, minWidth:150 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 1,
      renderCell: (params) => params.row.profile.name,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      flex: 1,
      renderCell: (params) => params.row.profile.email,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          size="small"
          onClick={() => handleResetPasswordDialogOpen(params.row.id)}
        >
          <Replay />
        </IconButton>
      ),
    },
  ];

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
            Add Account
          </Button>
        </Box>
        <DataGrid
          rows={accountData}
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
        <DialogTitle sx={{ mb: 0, pb: 0 }}>
          Add Account
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid sx={{ mt: 0.5 }} container spacing={2}>
            <Grid item xs={6} sm={12} md={6}>
              <TextField
                size="small"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.username}
                helperText={formErrors.username}
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
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
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
                label="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.fullname}
                helperText={formErrors.fullname}
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
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                fullWidth
                error={!!formErrors.password}
                helperText={formErrors.password}
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
            {submitting ? "Saving..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={handleResetPasswordDialogClose}
        TransitionComponent={Slide}
      >
        <DialogTitle sx={{ mb: 0, pb: 0 }}>
          Reset Password
          <IconButton
            aria-label="close"
            onClick={handleResetPasswordDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
          sx={{mt:2}}
            size="small"
            label="Password"
            name="password"
            type="password"
            error={!!resetPasswordError}
            helperText={resetPasswordError}
            value={resetPasswordData.password}
            onChange={handleResetPasswordFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleResetPasswordDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleResetPasswordSubmit}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {submitting ? "Resetting..." : "Reset"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(Accounts);
