import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Switch, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NetworkHandler from '../../../network/network_handler';
import withNavUpdate from '../../wrappers/with_nav_update';
import Tooltip from '@mui/material/Tooltip';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentEvent, setCurrentEvent] = useState({
        id: null,
        event_date: '',
        end_date: '',
        title: '',
        description: '',
        venue: '',
        show_attendance: true,
        recurrence: 'none',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const fetchedEvents = await new NetworkHandler().getMasjidEvent();
        setEvents(fetchedEvents);
    };

    const handleOpen = (event = null) => {
        if (event) {
            setIsEditMode(true);
            const formattedEventDate = event.formatted_event_date.slice(0, 16);
            const formattedEndDate = event.formatted_end_date.slice(0, 16);

            setCurrentEvent({
                ...event,
                event_date: formattedEventDate,
                end_date: formattedEndDate,
                show_attendance: event.show_attendance || false,
                recurrence: event.recurrence || 'none',
            });
        } else {
            setIsEditMode(false);
            setCurrentEvent({
                id: null,
                event_date: new Date().toISOString().slice(0, 16),
                end_date: new Date().toISOString().slice(0, 16),
                title: '',
                description: '',
                venue: '',
                show_attendance: false,
                recurrence: 'none',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const { id, event_date, end_date, title, description, venue, show_attendance, recurrence } = currentEvent;
        const formattedEventDate = `${event_date.toString().replace('T', ' ')}:00`;
        const formattedEndDate = `${end_date.toString().replace('T', ' ')}:00`;

        if (isEditMode) {
            await new NetworkHandler().editMasjidEvent(id, formattedEventDate, formattedEndDate, title, description, venue, show_attendance, recurrence);
        } else {
            await new NetworkHandler().addMasjidEvent(formattedEventDate, formattedEndDate, title, description, venue, show_attendance, recurrence);
        }

        fetchEvents();
        handleClose();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!currentEvent.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!currentEvent.event_date) {
            newErrors.event_date = 'Event date is required';
        } else {
            const selectedDate = new Date(currentEvent.event_date);
            const now = new Date();
            if (selectedDate < now) {
                newErrors.event_date = 'Event date cannot be in the past';
            }
        }

        if (!currentEvent.end_date) {
            newErrors.end_date = 'End date is required';
        } else {
            const selectedEndDate = new Date(currentEvent.end_date);
            const selectedEventDate = new Date(currentEvent.event_date);
            if (selectedEndDate < selectedEventDate) {
                newErrors.end_date = 'End date cannot be before the event date';
            }
        }

        if (!currentEvent.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!currentEvent.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }

        return newErrors;
    };

    const handleChange = (field, value) => {
        setCurrentEvent(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const columns = [
        { field: 'event_date', headerName: 'Event Date', width: 200 },
        { field: 'end_date', headerName: 'End Date', width: 200 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'yes_count', headerName: 'Attending', width: 100 },
        { field: 'no_count', headerName: 'Not Attending', width: 100 },
        { field: 'maybe_count', headerName: 'Maybe Attending', width: 150 },
        { field: 'venue', headerName: 'Venue', width: 200 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    color="primary"
                    size='small'
                    startIcon={<EditIcon />}
                    onClick={() => handleOpen(params.row)}
                >
                    Edit
                </Button>
            )
        }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Box sx={{ width: "100%", textAlign: "right" }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    style={{ marginBottom: '16px' }}
                >
                    Add Event
                </Button>
            </Box>
            <DataGrid
                rows={events}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogTitle>{isEditMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
                <DialogContent
                    sx={{ height: "80vh" }}
                >
                    <TextField
                        margin="dense"
                        label="Title"
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        value={currentEvent.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Event Date"
                        type="datetime-local"
                        error={!!errors.event_date}
                        helperText={errors.event_date}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentEvent.event_date}
                        onChange={(e) => handleChange('event_date', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="datetime-local"
                        error={!!errors.end_date}
                        helperText={errors.end_date}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentEvent.end_date}
                        onChange={(e) => handleChange('end_date', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Venue"
                        error={!!errors.venue}
                        helperText={errors.venue}
                        fullWidth
                        value={currentEvent.venue}
                        onChange={(e) => handleChange('venue', e.target.value)}
                    />
                    <Tooltip title="Controls if the total people attending is visible in the UI" arrow>
                        <FormControlLabel
                            sx={{ mt: 1, mb: 1 }}
                            control={
                                <Switch
                                    checked={currentEvent.show_attendance}
                                    onChange={(e) => handleChange('show_attendance', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Show Attendance"
                        />
                    </Tooltip>
                    <FormControl fullWidth margin="dense">
                        <InputLabel >Recurrence</InputLabel>
                        <Select
                            label="Recurrence"
                            value={currentEvent.recurrence}
                            onChange={(e) => handleChange('recurrence', e.target.value)}
                        >
                            <MenuItem value="none">Does not repeat</MenuItem>
                            <MenuItem value="repeats_daily">Repeats Daily</MenuItem>
                            <MenuItem value="repeats_weekly">Repeats Weekly</MenuItem>
                            <MenuItem value="repeats_monthly">Repeats Monthly</MenuItem>
                            <MenuItem value="repeats_yearly">Repeats Yearly</MenuItem>
                        </Select>
                    </FormControl>
                    <ReactQuill
                        theme="snow"
                        value={currentEvent.description}
                        onChange={(value) => handleChange('description', value)}
                        style={{ marginTop: '16px', height: '70%' }}
                    />
                    {errors.description && (
                        <p style={{ color: 'rgb(211, 47, 47)', fontSize: 13, marginLeft: 10 }}>{errors.description}</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withNavUpdate(EventManager);
