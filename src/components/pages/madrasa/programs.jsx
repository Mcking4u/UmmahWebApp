import React, { useState, useEffect } from 'react';
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    Slide,
    FormControl,
    InputLabel,
    Grid,
    Box,
} from '@mui/material';
import NetworkHandler from '../../../network/network_handler';
import withNavUpdate from '../../wrappers/with_nav_update';
import { Add, Edit } from '@mui/icons-material';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [madrasas, setMadrasas] = useState([]);
    const [selectedMadrasa, setSelectedMadrasa] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [programName, setProgramName] = useState('');
    const [currentProgramId, setCurrentProgramId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        const response = await new NetworkHandler().getPrograms();
        setPrograms(response.programs);
        setMadrasas(response.madrasas);
        setSelectedMadrasa(response.madrasas[0]?.id || '');
    };

    const handleMadrasaChange = (event) => {
        setSelectedMadrasa(event.target.value);
    };

    const handleAddProgram = () => {
        setDialogMode('add');
        setProgramName('');
        setOpenDialog(true);
    };

    const handleEditProgram = (programId, programName) => {
        setDialogMode('edit');
        setCurrentProgramId(programId);
        setProgramName(programName);
        setOpenDialog(true);
    };

    const handleSave = async () => {
        setLoading(true);
        if (dialogMode === 'add') {
            await new NetworkHandler().addProgram(selectedMadrasa, programName);
        } else if (dialogMode === 'edit') {
            await new NetworkHandler().editProgram(selectedMadrasa, currentProgramId, programName);
        }
        setLoading(false);
        setOpenDialog(false);
        fetchPrograms();
    };

    const filteredPrograms = programs.filter(
        (program) => program.madrasa === selectedMadrasa
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, flex: 1 },
        { field: 'name', headerName: 'Program Name', width: 200, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            width: 150,
            renderCell: (params) => (
                <Button
                    size='small'
                    startIcon={<Edit />}
                    variant="contained"
                    onClick={() => handleEditProgram(params.row.id, params.row.name)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Box sx={{ maxWidth: "550px", width: "100%" }}>
                <Grid container justifyContent={"space-between"} alignItems={"center"} >
                    <Grid item>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Madrasa</InputLabel>
                            <Select
                                value={selectedMadrasa}
                                onChange={handleMadrasaChange}
                                label="Madrasa"
                            >
                                {madrasas.map((madrasa) => (
                                    <MenuItem key={madrasa.id} value={madrasa.id}>
                                        {madrasa.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item>
                        <Button
                            size='small'
                            startIcon={<Add />}

                            variant="contained" color="primary" onClick={handleAddProgram}>
                            Add Program
                        </Button>
                    </Grid>
                </Grid>
                <div style={{ height: 400, marginTop: '20px' }}>
                    <DataGrid
                        rows={filteredPrograms}
                        columns={columns}
                        pageSize={5}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </div>
            </Box>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                TransitionComponent={Slide}
            >
                <DialogTitle>
                    {dialogMode === 'add' ? 'Add Program' : 'Edit Program'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Program Name"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        disabled={loading || !programName}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withNavUpdate(Programs);
