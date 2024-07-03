import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  styled, 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import SlideTransition from '../animation/slide_transition';



// Create a styled TextField component
const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    border: '1px solid #ced4da', // Add a subtle border
    borderRadius: '4px',
    padding: '10px', // Increase padding for better appearance
  },
  '& .MuiInputBase-input': {
    padding: '10px', // Adjust input padding
  },
});

function SalahTimings() {


  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(updateNavState({headerText: "Salah Timings", activeLink:"/salah-timings"}))
  }, [] );

  const timingsData = [
    { month: 'Ramadan', fajr: '4:30 AM', duhr: '12:15 PM', asr: '3:45 PM', maghrib: '6:50 PM', isha: '8:20 PM' },
    { month: 'Shawwal', fajr: '4:45 AM', duhr: '12:20 PM', asr: '3:50 PM', maghrib: '6:55 PM', isha: '8:25 PM' },
    { month: 'Dhu al-Qidah', fajr: '5:00 AM', duhr: '12:25 PM', asr: '4:00 PM', maghrib: '7:00 PM', isha: '8:30 PM' },
    { month: 'Dhu al-Hijjah', fajr: '5:15 AM', duhr: '12:30 PM', asr: '4:15 PM', maghrib: '7:10 PM', isha: '8:45 PM' },
    { month: 'Muharram', fajr: '5:30 AM', duhr: '12:40 PM', asr: '4:30 PM', maghrib: '7:20 PM', isha: '9:00 PM' },
    // ... more data rows
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    // Handle file upload logic here
    console.log('File uploaded');
    setToastState({
      open: true,
      vertical: "top",
      horizontal: "right",
      message:"File uploaded...",
    })
    handleCloseDialog();
  };

  const [toastState, setToastState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const { vertical, horizontal, open, message } = toastState;


  return (
    <Box>
      <Typography variant="h5" gutterBottom>Salah Timings</Typography>

      <Box sx={{ display: 'flex', mb: 2 }}>
        <Button 
        onClick={()=> setToastState({
          open: true,
          vertical: "top",
          horizontal: "right",
          message:"Downloading please wait...",
        })}
        startIcon={<DownloadIcon />} variant="outlined">
          Download Template
        </Button>
        <Button startIcon={<UploadIcon />} variant="outlined" sx={{ ml: 2 }} onClick={handleOpenDialog}>
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
            message:"",
          })
        }
      >
        {/* <Alert severity="success">Changes Saved!</Alert> */}
      </Snackbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the file to upload:
          </DialogContentText>
          <StyledTextField // Use the styled TextField
            autoFocus
            margin="dense"
            type="file"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Fajr</TableCell>
              <TableCell>Duhr</TableCell>
              <TableCell>Asr</TableCell>
              <TableCell>Maghrib</TableCell>
              <TableCell>Isha</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timingsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.fajr}</TableCell>
                <TableCell>{row.duhr}</TableCell>
                <TableCell>{row.asr}</TableCell>
                <TableCell>{row.maghrib}</TableCell>
                <TableCell>{row.isha}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} size="small">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}




export default () => (
  <SlideTransition>
    <SalahTimings />
  </SlideTransition>
);