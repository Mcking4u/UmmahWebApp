import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateNavState } from "../../redux/navSlice";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  styled,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import SlideTransition from "../animation/slide_transition";
import NetworkHandler from "../../network/network_handler";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const networkHandler = new NetworkHandler();

// Create a styled TextField component
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    border: "1px solid #ced4da", // Add a subtle border
    borderRadius: "4px",
    padding: "10px", // Increase padding for better appearance
  },
  "& .MuiInputBase-input": {
    padding: "10px", // Adjust input padding
  },
});

function SalahTimings() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateNavState({
        headerText: "Salah Timings",
        activeLink: "/masjid/salah-timings",
      })
    );
    fetchSalahTimings();
  }, []);

  const [salahTimings, setSalahTimings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [toastState, setToastState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  const fetchSalahTimings = async () => {
    try {
      const data = await networkHandler.getMasjidProfile();
      setSalahTimings(data[0].daily_prayer_times);
    } catch (error) {
      console.error("Error fetching salah timings:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { vertical, horizontal, open, message } = toastState;

  const handleDownload = () => {
    setToastState({
      open: true,
      vertical: "top",
      horizontal: "right",
      message: "Downloading please wait...",
    });

    const fileUrl = "/salah.xlsx";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "salah.xlsx";
    link.click();
  };

  const handleUpload = async (event) => {
    setToastState({
      open: true,
      vertical: "top",
      horizontal: "right",
      message: "Uploading...",
    });
    handleCloseDialog();
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await networkHandler.uploadSalahTimings(formData);
        setToastState({
          open: true,
          vertical: "top",
          horizontal: "right",
          message: "File uploaded...",
        });
        fetchSalahTimings();
      } catch (error) {
        console.error("Error uploading file:", error);
        setToastState({
          open: true,
          vertical: "top",
          horizontal: "right",
          message: "File upload failed...",
        });
      }
    }
  };

  const handleDateChange = (field, date) => {
    if (field === "start") {
      setStartDate(date);
    } else if (field === "end") {
      setEndDate(date);
    }
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
        <Button startIcon={<EditIcon />} size="small">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Salah Timings
        </Typography>

        <Box sx={{ display: "flex", mb: 2 }}>
          <Button
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            variant="outlined"
          >
            Download Template
          </Button>
          <Button
            startIcon={<UploadIcon />}
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={handleOpenDialog}
          >
            Upload
          </Button>
        </Box>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          message={message}
          anchorOrigin={{ vertical, horizontal }}
          onClose={() =>
            setToastState({
              open: false,
              vertical: "top",
              horizontal: "right",
              message: "",
            })
          }
        />

        <Box sx={{ display: "flex", mb: 2 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => handleDateChange("start", date)}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                size="small" 
                helperText="Filter dates" 
              />
            )}
          />
          <DatePicker
            label="End Date"
            renderInput={(params) => (
              <StyledTextField
                {...params}
                size="small" 
                helperText="Filter dates"
              />
            )}
            value={endDate}
            onChange={(date) => handleDateChange("end", date)}
            sx={{ ml: 2 }}
          />
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Upload Template</DialogTitle>
          <DialogContent>
            <DialogContentText>Select the file to upload:</DialogContentText>
            <StyledTextField // Use the styled TextField
              autoFocus
              margin="dense"
              type="file"
              fullWidth
              onChange={handleUpload}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
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

export default () => (
  <SlideTransition>
    <SalahTimings />
  </SlideTransition>
);
