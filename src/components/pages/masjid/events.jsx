import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material';
import { Add as AddIcon, Edit, Edit as EditIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NetworkHandler from '../../../network/network_handler';
import withNavUpdate from '../../wrappers/with_nav_update';

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
        venue: ''
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
            setCurrentEvent(event);
        } else {
            setIsEditMode(false);
            setCurrentEvent({
                id: null,
                event_date: new Date().toISOString().slice(0, 16),
                end_date: new Date().toISOString().slice(0, 16),
                title: '',
                description: '',
                venue: ''
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
            return; // Prevent saving if there are errors
        }
        const { id, event_date, end_date, title, description, venue } = currentEvent;
        const formattedEventDate = `${event_date.toString().replace('T', ' ')}:00`;
        const formattedEndDate = `${end_date.toString().replace('T', ' ')}:00`;

        if (isEditMode) {
            await new NetworkHandler().editMasjidEvent(id, formattedEventDate, formattedEndDate, title, description, venue);
        } else {
            await new NetworkHandler().addMasjidEvent(formattedEventDate, formattedEndDate, title, description, venue);
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
        // { field: 'description', headerName: 'Description', width: 300, flex: 1 },
        { field: 'venue', headerName: 'Venue', width: 200 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    color="primary"
                    size='small'
                    startIcon={<EditIcon startIcon={<Edit />} />}
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
                    sx={{ height: "80vh", }}
                >
                    <TextField
                        margin="dense"
                        label="Title"
                        error={!!errors.title} // Highlight the field if there's an error
                        helperText={errors.title} // Display the error message
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
                    <ReactQuill
                        theme="snow"
                        value={currentEvent.description}
                        onChange={(value) => handleChange('description', value)}
                        style={{ marginTop: '16px', height: '70%' }}
                    />
                    {errors.description && ( // Display description error below the editor
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
