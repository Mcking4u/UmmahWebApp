import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Grid, Switch, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import NetworkHandler from '../../../network/network_handler';
import withNavUpdate from '../../wrappers/with_nav_update';

const Payments = () => {
    const [madrasas, setMadrasas] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedMadrasa, setSelectedMadrasa] = useState('');
    const [allPrograms, setAllPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(dayjs().startOf('month'));
    const [feesData, setFeesData] = useState([]);

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            const initData = await new NetworkHandler().getFeesInit();
            const initialMadrasa = initData.madrasas[0];
            setMadrasas(initData.madrasas);
            setSelectedMadrasa(initialMadrasa.id);

            const filteredPrograms = initData.programs.filter(program => program.madrasa === initialMadrasa.id);
            const initialProgram = filteredPrograms[0];
            setPrograms(filteredPrograms);
            setAllPrograms(initData.programs);
            setSelectedProgram(initialProgram.id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedMadrasa && selectedProgram && selectedMonth) {
            const fetchFeesData = async () => {
                const formattedDate = selectedMonth.format('YYYY-MM-DD');
                const data = await new NetworkHandler().getFees(selectedMadrasa, selectedProgram, formattedDate);
                setFeesData(data);
            };
            fetchFeesData();
        }
    }, [selectedMadrasa, selectedProgram, selectedMonth]);

    const handleMadrasaChange = (event) => {
        const madrasaId = event.target.value;
        setSelectedMadrasa(madrasaId);

        const filteredPrograms = allPrograms.filter(program => program.madrasa === madrasaId);
        setPrograms(filteredPrograms);
        if (filteredPrograms.length > 0) {
            setSelectedProgram(filteredPrograms[0].id);
        }
    };

    const handleProgramChange = (event) => {
        setSelectedProgram(event.target.value);
    };

    const handlePaidChange = async (feeId, isPaid) => {
        try {

            // Update the 'feesData' state directly
            setFeesData((prevFeesData) =>
                prevFeesData.map((fee) =>
                    fee.id === feeId ? { ...fee, is_paid: isPaid } : fee
                )
            );
            await new NetworkHandler().markFee(feeId, isPaid);

        } catch (error) {
            console.error("Error marking fee:", error);
            // Handle the error, maybe show an error message to the user
        }
    };

    const columns = [

        { field: 'month', headerName: 'Month', width: 130 },
        { field: 'studentName', headerName: 'Student Name', width: 200 },

        { field: 'parentName', headerName: 'Parent Name', width: 200 },
        { field: 'emergencyContact', headerName: 'Emergency Contact', width: 200, flex: 1 },
        {
            field: 'is_paid', headerName: 'Fee Paid', width: 100, renderCell: (params) => (
                <Switch
                    checked={params.row.is_paid}
                    onChange={(event) => handlePaidChange(params.row.id, event.target.checked)}
                />
            )
        },
    ];

    const rows = feesData.map(fee => ({
        id: fee.id,
        month: fee.month,
        studentName: fee.student.name,
        is_paid: fee.is_paid,
        parentName: fee.student.parent_name,
        emergencyContact: fee.student.emergency_contact,
    }));

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Month / Year"
                        value={selectedMonth}
                        views={["year", "month"]}
                        onChange={(newDate) => setSelectedMonth(dayjs(newDate).startOf('month'))}
                        slots={{
                            textField: TextField,
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel id="madrasa-select-label">Select Madrasa</InputLabel>
                    <Select
                        labelId="madrasa-select-label"
                        value={selectedMadrasa}
                        label="Select Madrasa"
                        onChange={handleMadrasaChange}
                    >
                        {madrasas.map(madrasa => (
                            <MenuItem key={madrasa.id} value={madrasa.id}>{madrasa.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel id="program-select-label">Select Program</InputLabel>
                    <Select
                        labelId="program-select-label"
                        label="Select Program"
                        value={selectedProgram}
                        onChange={handleProgramChange}
                    >
                        {programs.map(program => (
                            <MenuItem key={program.id} value={program.id}>{program.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[50]}

                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default withNavUpdate(Payments);
