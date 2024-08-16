import React, { useState, useEffect } from 'react';
import {
    Button, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
    Slide, TextField, FormControl, InputLabel, Grid, Autocomplete, Box,
    CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { forwardRef } from 'react';
import { Add, Edit } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import withNavUpdate from '../../wrappers/with_nav_update';
import NetworkHandler from '../../../network/network_handler';

// Slide transition for the dialog
const SlideTransition = forwardRef(function SlideTransition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Sessions() {
    const [open, setOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [madrasas, setMadrasas] = useState([]);
    const [selectedMadrasa, setSelectedMadrasa] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [formData, setFormData] = useState({
        day: '',
        name: '',
        startTime: null,
        endTime: null,
        gender: '',
        teachers: []
    });
    const [loading, setLoading] = useState(true);

    async function fetchSessions() {
        const response = await new NetworkHandler().getSessions();
        setMadrasas(response);
        setSelectedMadrasa(response[selectedIndex]);
        setSessions(response[selectedIndex].sessions);
        setTeachers(response[selectedIndex].teachers);
        setLoading(false);
    }

    useEffect(() => {
        // Fetch madrasas and their sessions
        fetchSessions();
    }, []);

    const handleMadrasaChange = (event) => {
        const madrasa = madrasas.find(m => m.id === event.target.value);
        const madrasaIndex = madrasas.findIndex(m => m.id === event.target.value);
        setSelectedIndex(madrasaIndex);
        setSelectedMadrasa(madrasa);
        setSessions(madrasa.sessions);
        setTeachers(madrasa.teachers); // Update teachers when madrasa changes
    };

    const handleOpen = (session) => {
        setSelectedSession(session);
        if (session) {
            setFormData({
                day: session.row.day,
                startTime: dayjs(session.row.start_time, 'HH:mm'),
                endTime: dayjs(session.row.end_time, 'HH:mm'),
                gender: session.row.gender,
                teachers: session.row.teachers,
                name: session.row.name,
            });
        } else {
            setFormData({
                day: '',
                startTime: null,
                endTime: null,
                gender: '',
                teachers: [],
                name: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const { day, startTime, endTime, gender, teachers, name } = formData;
        const teacherIds = teachers;
        const formattedStartTime = startTime ? startTime.format('HH:mm') : '';
        const formattedEndTime = endTime ? endTime.format('HH:mm') : '';

        if (selectedSession) {
            // Edit existing session
            await new NetworkHandler().editSession(selectedMadrasa.id, day, formattedStartTime, formattedEndTime, gender, selectedSession.id, teacherIds, name);
            await fetchSessions();
        } else {
            // Add new session
            await new NetworkHandler().addSession(selectedMadrasa.id, day, formattedStartTime, formattedEndTime, gender, teacherIds, name);
            await fetchSessions();
        }
        handleClose();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTimeChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const columns = [
        { field: 'day', headerName: 'Session Day', width: 150 },
        { field: 'name', headerName: 'Session Name', width: 150 },
        { field: 'start_time', headerName: 'Start Time', width: 150 },
        { field: 'end_time', headerName: 'End Time', width: 150 },
        { field: 'gender', headerName: 'Gender', width: 150 },
        {
            field: 'teachers',
            headerName: 'Teacher',
            width: 200,
            flex: 1,
            valueGetter: (params) => {
                // Safely handle cases where teachers might be undefined
                return params ? params.map(t => t.profile.name).join(', ') : '';
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    size="small"
                    startIcon={<Edit />}
                    variant="contained" color="primary" onClick={() => handleOpen(params)}>
                    Edit
                </Button>
            )
        }
    ];

    if (loading) {
        return <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ padding: 20 }}>
                <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
                    <FormControl size="small" style={{ minWidth: 200 }}>
                        <InputLabel>Select a Madrasa</InputLabel>
                        <Select
                            value={selectedMadrasa?.id || ''}
                            onChange={handleMadrasaChange}
                            label="Select a Madrasa"
                        >
                            {madrasas.map(madrasa => (
                                <MenuItem key={madrasa.id} value={madrasa.id}>{madrasa.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained"
                        size='small'
                        startIcon={<Add />}
                        color="primary" onClick={() => handleOpen(null)}>
                        Add Session
                    </Button>
                </Grid>

                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={sessions} columns={columns} pageSize={5} />
                </div>

                <Dialog
                    open={open}
                    TransitionComponent={SlideTransition}
                    onClose={handleClose}
                >
                    <DialogTitle>{selectedSession ? "Edit Session" : "Add Session"}</DialogTitle>
                    <DialogContent sx={{ maxWidth: '400px' }}>
                        <Box sx={{ '& .MuiFormControl-root': { mb: 2, width: '100%' } }}>
                            <TextField
                                sx={{ mt: 1 }}
                                label="Session Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth

                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <FormControl  >
                                <InputLabel>Session Day</InputLabel>
                                <Select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleChange}
                                    label="Session Day"
                                >
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                </Select>
                            </FormControl>
                            <TimePicker
                                label="Start Time"
                                size="small"
                                value={formData.startTime}
                                onChange={(newValue) => handleTimeChange('startTime', newValue)}
                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                            />
                            <TimePicker
                                label="End Time"
                                size="small"
                                value={formData.endTime}
                                onChange={(newValue) => handleTimeChange('endTime', newValue)}
                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                            />
                            <FormControl >
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="Boys">Boys</MenuItem>
                                    <MenuItem value="Girls">Girls</MenuItem>
                                    <MenuItem value="Adult Male">Adult Male</MenuItem>
                                    <MenuItem value="Adult Female">Adult Female</MenuItem>
                                </Select>
                            </FormControl>
                            <Autocomplete
                                multiple
                                options={teachers}
                                getOptionLabel={(option) => option.profile.name}
                                value={formData.teachers}
                                onChange={(event, newValue) => {
                                    setFormData({
                                        ...formData,
                                        teachers: newValue
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Teachers"
                                        placeholder="Select Teachers"

                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
}

export default withNavUpdate(Sessions);
