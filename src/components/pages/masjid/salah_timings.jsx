import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  styled,
  TextField,
  Slide,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import NetworkHandler from "../../../network/network_handler";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import withNavUpdate from "../../wrappers/with_nav_update";

const networkHandler = new NetworkHandler();

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    border: "1px solid #ced4da",
    borderRadius: "4px",
    padding: "10px",
  },
  "& .MuiInputBase-input": {
    padding: "10px",
  },
});

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SalahTimings() {
  useEffect(() => {
    fetchSalahTimings();
  }, []);

  const [salahTimings, setSalahTimings] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openFixDialog, setOpenFixDialog] = useState(false);
  const [toastState, setToastState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  // State for Fix Salah Timings dialog
  const [fixStartDate, setFixStartDate] = useState(null);
  const [fixEndDate, setFixEndDate] = useState(null);
  const [selectedSalah, setSelectedSalah] = useState('');
  const [salahTime, setSalahTime] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchSalahTimings = async () => {
    try {
      const data = await networkHandler.getMasjidProfile();
      setSalahTimings(data[0].daily_prayer_times);
    } catch (error) {
      console.error("Error fetching salah timings:", error);
    }
  };

  const handleOpenEditDialog = (timing) => {
    setSelectedTiming(timing);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedTiming(null);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenFixDialog = () => {
    setOpenFixDialog(true);
    setFixStartDate(null);
    setFixEndDate(null);
    setSelectedSalah('');
    setSalahTime(null);
    setErrors({});
  };

  const handleCloseFixDialog = () => {
    setOpenFixDialog(false);
  };

  const handleDownload = () => {
    const fileUrl = "/salah.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "salah.xlsx";
    link.click();
  };

  const handleUpload = async (event) => {
    handleCloseUploadDialog();
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await networkHandler.uploadSalahTimings(formData);
        setToastState({ open: true, message: "File uploaded..." });
        fetchSalahTimings();
      } catch (error) {
        console.error("Error uploading file:", error);
        setToastState({ open: true, message: "File upload failed..." });
      }
    }
  };

  const handleEditSubmit = async () => {
    if (selectedTiming) {
      try {
        await networkHandler.updateNamazTiming(selectedTiming);
        setToastState({ open: true, message: "Timing updated successfully!" });
        fetchSalahTimings();
      } catch (error) {
        console.error("Error updating timing:", error);
        setToastState({ open: true, message: "Error updating timing." });
      }
      handleCloseEditDialog();
    }
  };

  const handleFixSubmit = async () => {
    const newErrors = {};
    if (!fixStartDate) newErrors.startDate = "Start date is required";
    if (!fixEndDate) newErrors.endDate = "End date is required";
    if (!selectedSalah) newErrors.selectedSalah = "Select Salah is required";
    if (!salahTime) newErrors.salahTime = "Salah time is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      start_date: fixStartDate.format("YYYY-MM-DD"),
      end_date: fixEndDate.format("YYYY-MM-DD"),
      attribute_key: selectedSalah,
      attribute_value: salahTime.format("HH:mm:ss"),
    };

    try {
      const response = await networkHandler.rangeUpdateNamazTiming(payload);
      setToastState({ open: true, message: response.message });
      fetchSalahTimings();
      handleCloseFixDialog();
    } catch (error) {
      console.error("Error fixing timings:", error);
      setToastState({ open: true, message: "Error fixing timings." });
    }
  };

  const handleTimeChange = (field, time) => {
    setSelectedTiming((prev) => ({ ...prev, [field]: time.format("HH:mm:ss") }));
  };

  const filteredSalahTimings = salahTimings.filter((timing) => {
    const timingDate = dayjs(timing.date, "YYYY-MM-DD");
    return timingDate.isBetween(startDate, endDate, null, "[]");
  });

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "day", headerName: "Day", width: 100 },
    { field: "fajar", headerName: "Fajr", width: 100 },
    { field: "zuhur", headerName: "Duhr", width: 100 },
    { field: "asar", headerName: "Asr", width: 100 },
    { field: "maghrib", headerName: "Maghrib", width: 100 },
    { field: "isha", headerName: "Isha", width: 100 },
    { field: "juma", headerName: "Juma", width: 100 },
    {
      field: "actions",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <Button
          startIcon={<EditIcon />}
          size="small"
          onClick={() => handleOpenEditDialog(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Button onClick={handleDownload} startIcon={<DownloadIcon />} variant="outlined" size="small">
            Download Template
          </Button>
          <Button startIcon={<UploadIcon />} variant="outlined" sx={{ ml: 2 }} size="small" onClick={handleOpenUploadDialog}>
            Upload
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} size="small" onClick={handleOpenFixDialog}>
            Fix Salah Timings
          </Button>
        </Box>

        <Snackbar
          open={toastState.open}
          autoHideDuration={3000}
          message={toastState.message}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setToastState({ ...toastState, open: false })}
        />

        <Box sx={{ display: "flex", mb: 2 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            slots={{ textField: StyledTextField }}
            slotProps={{ textField: { size: "small", helperText: "Filter dates" } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            sx={{ ml: 2 }}
            slots={{ textField: StyledTextField }}
            slotProps={{ textField: { size: "small", helperText: "Filter dates" } }}
          />
        </Box>

        {/* Fix Salah Timings Dialog */}
        <Dialog open={openFixDialog} onClose={handleCloseFixDialog} TransitionComponent={Transition}>
          <DialogTitle >Fix Salah Timings</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2, mt: 1 }}>
              <DatePicker
                label="Start Date"
                value={fixStartDate}
                onChange={(date) => setFixStartDate(date)}
                slots={{ textField: StyledTextField }}
                slotProps={{ textField: { size: "small", error: !!errors.startDate, helperText: errors.startDate } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="End Date"
                value={fixEndDate}
                onChange={(date) => setFixEndDate(date)}
                slots={{ textField: StyledTextField }}
                slotProps={{ textField: { size: "small", error: !!errors.endDate, helperText: errors.endDate } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth error={!!errors.selectedSalah}>
                <InputLabel>Select Salah</InputLabel>
                <Select
                  value={selectedSalah}
                  onChange={(e) => setSelectedSalah(e.target.value)}
                  label="Select Salah"
                >
                  {['fajar', 'zuhur', 'asar', 'maghrib', 'isha', 'juma', 'juma2'].map((salah) => (
                    <MenuItem key={salah} value={salah}>{salah.charAt(0).toUpperCase() + salah.slice(1)}</MenuItem>
                  ))}
                </Select>
                {errors.selectedSalah && <p style={{ color: 'red' }}>{errors.selectedSalah}</p>}
              </FormControl>
            </Box>
            <Box sx={{ mb: 2, }}>
              <TimePicker
                sx={{ width: "100%" }}
                label="Salah Time"
                value={salahTime}
                onChange={(time) => setSalahTime(time)}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    error={!!errors.salahTime}
                    helperText={errors.salahTime}
                  />
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseFixDialog}>Cancel</Button>
            <Button onClick={handleFixSubmit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Timing Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Salah Timing</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Update the prayer times:</DialogContentText>
            {selectedTiming && (
              <>
                {["fajar", "zuhur", "asar", "maghrib", "isha", "juma", "juma2"].map((timeField) => (
                  <Box key={timeField} sx={{ mb: 2 }}>
                    <TimePicker
                      label={timeField.charAt(0).toUpperCase() + timeField.slice(1)}
                      value={dayjs(selectedTiming[timeField], "HH:mm:ss")}
                      onChange={(time) => handleTimeChange(timeField, time)}
                      renderInput={(params) => <StyledTextField {...params} />}
                    />
                  </Box>
                ))}
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleEditSubmit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Upload Template Dialog */}
        <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
          <DialogTitle>Upload Template</DialogTitle>
          <DialogContent>
            <DialogContentText>Select the file to upload:</DialogContentText>
            <StyledTextField
              autoFocus
              margin="dense"
              type="file"
              fullWidth
              onChange={handleUpload}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredSalahTimings}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default withNavUpdate(SalahTimings);
