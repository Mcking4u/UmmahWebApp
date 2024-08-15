import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Slide,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SlideTransition from "../../animation/slide_transition";
import NetworkHandler from "../../../network/network_handler";
import { Add, Edit, Email, Person, Phone } from "@mui/icons-material";
import withNavUpdate from "../../wrappers/with_nav_update";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const countryCodes = ["+358", "+92", "+91"];

const Teachers = () => {
  const [teachersData, setTeachersData] = useState([]);
  const [selectedMadrasa, setSelectedMadrasa] = useState(0);
  const [madrasas, setMadrasas] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    madrasa: "",
    countryCode: countryCodes[0],
  });
  const [formErrors, setFormErrors] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    madrasa: "",
  });
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const fetchData = async () => {
    const networkHandler = new NetworkHandler();
    const data = await networkHandler.getTeachers();
    setMadrasas(data.madrasas);
    setTeachersData(data.madrasas[selectedMadrasa]?.teachers || []);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMadrasa]);

  const handleMadrasaChange = (event) => {
    setSelectedMadrasa(event.target.value);
    setTeachersData(madrasas[event.target.value]?.teachers || []);
  };

  const columns = [
    { field: "username", headerName: "Username", width: 150, flex: 1, minWidth: 150 },
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
      width: 150,
      renderCell: (params) => (
        <Button
          startIcon={<Edit />}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (teacher) => {
    const matchedCountryCode = countryCodes.find((code) =>
      teacher.username.startsWith(code)
    );

    setSelectedTeacherId(teacher.id);
    setForm({
      phoneNumber: teacher.username.replace(matchedCountryCode, ""),
      name: teacher.profile.name,
      email: teacher.profile.email,
      madrasa: teacher.madrasa_id,
      countryCode: matchedCountryCode || countryCodes[0],
    });
    setIsEditMode(true);
    setOpen(true);
  };

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm({
      phoneNumber: "",
      name: "",
      email: "",
      madrasa: "",
      countryCode: countryCodes[0],
    });
    setFormErrors({
      phoneNumber: "",
      name: "",
      email: "",
      madrasa: "",
    });
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryCodeChange = (event) => {
    setForm({
      ...form,
      countryCode: event.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};
    let valid = true;

    if (!form.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
      valid = false;
    }

    if (!form.name) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!form.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email address is invalid";
      valid = false;
    }

    if (!isEditMode && !form.madrasa) {
      errors.madrasa = "Madrasa is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const networkHandler = new NetworkHandler();
      try {
        const teacherData = {
          username: `${form.countryCode}${form.phoneNumber}`,
          name: form.name,
          email: form.email,
        };

        if (isEditMode) {
          await networkHandler.editTeacher(selectedTeacherId, teacherData);
        } else {
          await networkHandler.addTeacher({
            ...teacherData,
            madrasa_id: form.madrasa,
          });
        }

        handleCloseDialog();
        fetchData();
      } catch (error) {
        console.error("Error saving teacher:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Grid container sx={{ marginBottom: 2, width: "100%" }} spacing={2} alignItems="center">
        <Grid item>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Madrasa</InputLabel>
            <Select
              value={selectedMadrasa}
              onChange={handleMadrasaChange}
              label="Select Madrasa"
              sx={{ minWidth: 150 }}
            >
              {madrasas.map((madrasa, index) => (
                <MenuItem key={index} value={index}>
                  {madrasa.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item flexGrow={1}>
          <Box sx={{ with: "100%", textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Add />}
              onClick={handleOpenDialog}
            >
              Add Teacher
            </Button>
          </Box>
        </Grid>
      </Grid>

      <DataGrid
        rows={teachersData}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {isEditMode ? "Edit Teacher" : "Add Teacher"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ maxWidth: 300 }}>
          <Grid sx={{ mt: 1 }} container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                size="small"
                value={form.phoneNumber}
                onChange={handleFormChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormControl variant="standard" size="small" sx={{ marginRight: 1 }}>
                        <Select
                          value={form.countryCode}
                          onChange={handleCountryCodeChange}
                          input={<InputBase />}
                          sx={{
                            minWidth: 70,
                            "& .MuiSelect-select": {
                              paddingLeft: 0,
                            },
                            "& .MuiSelect-icon": {
                              display: 'none', // Hide the dropdown icon if needed
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: 'none', // Remove the border
                            },
                          }}
                        >
                          {countryCodes.map((code) => (
                            <MenuItem key={code} value={code}>
                              {code}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Name"
                name="name"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                value={form.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Email"
                name="email"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                value={form.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
              />
            </Grid>
            {!isEditMode && (
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Madrasa</InputLabel>
                  <Select
                    label="Madrasa"
                    name="madrasa"
                    value={form.madrasa}
                    onChange={handleFormChange}
                    error={!!formErrors.madrasa}
                  >
                    {madrasas.map((madrasa) => (
                      <MenuItem key={madrasa.id} value={madrasa.id}>
                        {madrasa.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.madrasa && (
                    <p style={{ color: "red" }}>{formErrors.madrasa}</p>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(Teachers);
