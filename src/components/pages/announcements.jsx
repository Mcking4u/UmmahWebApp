import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';
import SlideTransition from '../animation/slide_transition';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { makeStyles } from  "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
  },
 
  form: {
    padding: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },

}));

const announcements = [
  { id: 1, message: 'Example announcement', date: '2024-07-02' },
  // Add more announcements as needed
];

const Announcements = () => {

  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(updateNavState({headerText: "Announcements", activeLink:"/announcements"}))
  }, [] );

  const classes = useStyles();

  return (
    <div className={classes.root}>
       <Typography variant="h6" color="inherit">
            Make Announcements
          </Typography>

          <Paper className={classes.paper} elevation={3}>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              id="announcement-message"
              label="Announcement Message"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Grid container spacing={2} alignItems="center"
            sx={{mt:2}}
            >
              <Grid item xs={12} md={6}>
                {/* Date and Time Field */}
                <TextField
                  id="announcement-date"
                  label="Announcement Date"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Send Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<SendIcon />}
                  
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Announcement History */}
        <Typography variant="h6" gutterBottom>
          Announcement History
        </Typography>
        <Paper className={classes.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>{announcement.id}</TableCell>
                    <TableCell>{announcement.message}</TableCell>
                    <TableCell>{announcement.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    </div>
  );
};


export default () => (
  <SlideTransition>
      <Announcements />
  </SlideTransition>
);