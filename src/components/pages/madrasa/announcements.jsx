import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slide,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import { Add, Close, Description, Title } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AddAnnouncementDialog = ({ open, onClose, madrasas, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMadrasa, setSelectedMadrasa] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [madrasaError, setMadrasaError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Reset errors
    setTitleError("");
    setDescriptionError("");
    setMadrasaError("");

    // Validation
    let valid = true;

    if (!title) {
      setTitleError("Title is required");
      valid = false;
    }
    if (!description) {
      setDescriptionError("Description is required");
      valid = false;
    }
    if (!selectedMadrasa) {
      setMadrasaError("Madrasa selection is required");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    const payload = {
      title,
      description,
      madrasa_id: selectedMadrasa,
    };
    await new NetworkHandler().addMadrasaAnnouncement(payload);
    onSave();
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add Announcement
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: "400px" }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title />
                </InputAdornment>
              ),
            }}
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError}
          />
          <TextField
            label="Description"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              ),
            }}
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!descriptionError}
            helperText={descriptionError}
          />
          <FormControl fullWidth error={!!madrasaError}>
            <InputLabel id="select-madrasa-label">Select Madrasa</InputLabel>
            <Select
              labelId="select-madrasa-label"
              value={selectedMadrasa}
              onChange={(e) => setSelectedMadrasa(e.target.value)}
              label="Select Madrasa"
            >
              {madrasas.map((madrasa) => (
                <MenuItem key={madrasa.id} value={madrasa.id}>
                  {madrasa.name}
                </MenuItem>
              ))}
            </Select>
            {madrasaError && (
              <p style={{ color: "red", margin: "3px 0 0 0" }}>
                {madrasaError}
              </p>
            )}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSave}
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [madrasaNames, setMadrasaNames] = useState([]);
  const [madrasas, setMadrasas] = useState([]);
  const [selectedMadrasa, setSelectedMadrasa] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const data = await new NetworkHandler().getMadrasaAnnouncements();
      const allAnnouncements = [];
      const names = [];

      data.announcements.forEach((madrasa) => {
        names.push(madrasa.name);
        madrasa.announcements.forEach((announcement) => {
          allAnnouncements.push({
            ...announcement,
            madrasaName: madrasa.name,
          });
        });
      });

      setAnnouncements(allAnnouncements);
      setMadrasaNames(names);
      setSelectedMadrasa("");
      setFilteredAnnouncements(allAnnouncements);
      setMadrasas(data.madrasas);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMadrasaChange = (event) => {
    const selected = event.target.value;
    setSelectedMadrasa(selected);

    if (selected === "") {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(
        (announcement) => announcement.madrasaName === selected
      );
      setFilteredAnnouncements(filtered);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = async () => {
    fetchData();
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "created_at", headerName: "Created At", flex: 1 },
  ];

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
        <Box sx={{ width: "100%", flexShrink: 0, mb: 2 }}>
          <Grid
            container
            sx={{ width: "100%" }}
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <FormControl sx={{ minWidth: 150 }} fullWidth>
                <InputLabel id="madrasa-select-label">
                  Select Madrasa
                </InputLabel>
                <Select
                  labelId="madrasa-select-label"
                  value={selectedMadrasa}
                  onChange={handleMadrasaChange}
                  label="Select Madrasa"
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  {madrasaNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item flexGrow={1}>
              <Box sx={{ width: "100%", textAlign: "right" }}>
                <Button
                  size="small"
                  startIcon={<Add />}
                  variant="contained"
                  color="primary"
                  onClick={handleDialogOpen}
                >
                  Add Announcement
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
            rows={filteredAnnouncements}
            columns={columns}
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
            getRowId={(row) => row.id}
          />
        )}
      </Box>

      <AddAnnouncementDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        madrasas={madrasas}
        onSave={handleSave}
      />
    </Box>
  );
};

export default withNavUpdate(Announcements);
