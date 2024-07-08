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

    const payload = {
      title,
      description,
      madrasa_id: selectedMadrasa,
    };
    await new NetworkHandler().addMadrasaAnnouncement(payload);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle sx={{ textAlign: "center" }}>
        Add Announcement
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{maxWidth:300}}>
        <TextField
          margin="dense"
          label="Title"
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                 <Title />
              </InputAdornment>
            ),
          }}
          size="small"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!titleError}
          helperText={titleError}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                  <Description />
              </InputAdornment>
            ),
          }}
          multiline
          rows={2}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!descriptionError}
          helperText={descriptionError}
        />
        <FormControl fullWidth margin="dense" error={!!madrasaError}>
          <InputLabel id="select-madrasa-label">Select Madrasa</InputLabel>
          <Select
            labelId="select-madrasa-label"
            value={selectedMadrasa}
            onChange={(e) => setSelectedMadrasa(e.target.value)}
            label="Select Madrasa"
            size="small"
          >
            {madrasas.map((madrasa) => (
              <MenuItem key={madrasa.id} value={madrasa.id}>
                {madrasa.name}
              </MenuItem>
            ))}
          </Select>
          {madrasaError && (
            <p style={{ color: "red", margin: "3px 0 0 0" }}>{madrasaError}</p>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  color="secondary" >Cancel</Button>
        <Button onClick={handleSave} color="primary">
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

  const fetchData = async () => {
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
    <div style={{ height: 400, width: "100%" }}>
      <Grid
        container
        sx={{ marginBottom: 2, width: "100%" }}
        spacing={2}
        alignItems="center"
      >
        <Grid item>
          <FormControl sx={{ minWidth: 150 }} fullWidth margin="normal">
            <InputLabel id="madrasa-select-label">Select Madrasa</InputLabel>
            <Select
              labelId="madrasa-select-label"
              value={selectedMadrasa}
              onChange={handleMadrasaChange}
              label="Select Madrasa"
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
          <Box sx={{ with: "100%", textAlign: "right" }}>
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
      <DataGrid
        rows={filteredAnnouncements}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        getRowId={(row) => row.id}
      />
      <AddAnnouncementDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        madrasas={madrasas}
        onSave={handleSave}
      />
    </div>
  );
};

export default withNavUpdate(Announcements);
