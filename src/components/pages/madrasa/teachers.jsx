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
  Stack,
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
  const [dataLoading, setDataLoading] = useState(true);
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
    try {
      setDataLoading(true);
      const networkHandler = new NetworkHandler();
      const data = await networkHandler.getTeachers();
      setMadrasas(data.madrasas);
      setTeachersData(data.madrasas[selectedMadrasa]?.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMadrasa]);

  const handleMadrasaChange = (event) => {
    setSelectedMadrasa(event.target.value);
    setTeachersData(madrasas[event.target.value]?.teachers || []);
  };

  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
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
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {!dataLoading && (
        <Box sx={{ width: "100%", flexShrink: 0 }}>
          <Grid
            container
            sx={{ marginBottom: 2, width: "100%" }}
            alignItems="center"
          >
            <Grid item>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Madrasa</InputLabel>
                <Select
                  value={selectedMadrasa}
                  onChange={handleMadrasaChange}
                  label="Select Madrasa"
                  size="small"
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
              <Box sx={{ width: "100%", textAlign: "right" }}>
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
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {dataLoading ? (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={teachersData}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            autoHeight={false}
            sx={{
              height: "100%",
              width: "100%",
              flex: 1,
              minHeight: 0,
            }}
            loading={dataLoading}
          />
        )}
      </Box>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        keepMounted
      >
        <DialogTitle>
          {isEditMode ? "Edit Teacher" : "Add Teacher"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              placeholder="442446786"
              value={form.phoneNumber}
              onChange={handleFormChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ marginRight: 1 }}
                    >
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
                            display: "none", // Hide the dropdown icon if needed
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none", // Remove the border
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

            <TextField
              label="Name"
              name="name"
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

            <TextField
              label="Email"
              name="email"
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

            {!isEditMode && (
              <FormControl fullWidth variant="outlined">
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
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            color="primary"
          >
            {isEditMode ? "Save Teacher" : "Add Teacher"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(Teachers);
