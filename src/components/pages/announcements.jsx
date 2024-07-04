import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';
import SlideTransition from '../animation/slide_transition';
import NetworkHandler from '../../network/network_handler';
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

const Announcements = () => {
  const dispatch = useDispatch();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');

  useEffect(() => {
    dispatch(updateNavState({ headerText: "Announcements", activeLink: "/masjid/announcements" }));
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await new NetworkHandler().getAnnouncements();
      const formattedAnnouncements = data.announcements.map(item => ({
        id: item.announcement_time, // Use a unique identifier here
        message: item.announcement_desc,
        date: item.announcement_time
      }));
      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementMessage || !announcementDate) return;
    setLoading(true);
    try {
      /*
      {
        text: announcementMessage,
        date: announcementDate
      }
      */
      await new NetworkHandler().sendAnnouncement(announcementMessage);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to send announcement', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6" color="inherit">
        Make Announcements
      </Typography>

      <Paper sx={{ mb: 2 }} elevation={3}>
        <form style={{ padding: '10px' }} noValidate autoComplete="off">
          <TextField
            id="announcement-message"
            label="Announcement Message"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
          />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                id="announcement-date"
                label="Announcement Date"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
                value={announcementDate}
                onChange={(e) => setAnnouncementDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendIcon />}
                onClick={handleSendAnnouncement}
                disabled={loading}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Announcement History
      </Typography>
      <Paper sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <CircularProgress />
        ) : (
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
        )}
      </Paper>
    </div>
  );
};

export default () => (
  <SlideTransition>
    <Announcements />
  </SlideTransition>
);
