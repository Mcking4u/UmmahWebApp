import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import {
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import NetworkHandler from '../../../network/network_handler';
import { ViewArray } from '@mui/icons-material';
import withNavUpdate from '../../wrappers/with_nav_update';

const TeachersMapping = () => {
  const [data, setData] = useState([]);
  const [madrasas, setMadrasas] = useState([]);
  const [selectedMadrasa, setSelectedMadrasa] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await new NetworkHandler().getAssignedStudents();
      setMadrasas(response.madrasas);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMadrasa) {
      const filteredData = madrasas
        .find((madrasa) => madrasa.name === selectedMadrasa)
        ?.teachers.map((teacher, index) => ({
          id: index,
          username: teacher.username,
          name: teacher.profile.name,
          email: teacher.profile.email,
          students: teacher.my_students,
        }));
      setData(filteredData || []);
    } else {
      const allTeachers = madrasas.flatMap((madrasa) =>
        madrasa.teachers.map((teacher, index) => ({
          id: `${madrasa.name}-${index}`,
          username: teacher.username,
          name: teacher.profile.name,
          email: teacher.profile.email,
          students: teacher.my_students,
        }))
      );
      setData(allTeachers);
    }
  }, [selectedMadrasa, madrasas]);

  const handleViewStudents = (students) => {
    setSelectedStudents(students);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudents([]);
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 150, flex:1 , minWidth:150},
    { field: 'name', headerName: 'Name', width: 150, flex:1 },
    { field: 'email', headerName: 'Email', width: 200, flex:1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      flex: .8,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<ViewArray />}
          size="small"
          disabled={params.row.students.length <= 0}
          onClick={() => handleViewStudents(params.row.students)}
        >
          View Students
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
        <InputLabel id="madrasa-select-label">Filter by Madrasa</InputLabel>
        <Select
          labelId="madrasa-select-label"
          id="madrasa-select"
          value={selectedMadrasa}
          label="Filter by Madrasa"
          onChange={(e) => setSelectedMadrasa(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {madrasas.map((madrasa, index) => (
            <MenuItem key={index} value={madrasa.name}>
              {madrasa.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ height: 400, width: '100%', mt:2 }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Students</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student's Name</TableCell>
                  <TableCell>Parent's Name</TableCell>
                  <TableCell>Emergency Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.parent_name}</TableCell>
                    <TableCell>{student.emergency_contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default withNavUpdate(TeachersMapping);
