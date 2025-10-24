import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
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
  CircularProgress,
  Slide,
  IconButton,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import { ViewArray, Close } from "@mui/icons-material";
import withNavUpdate from "../../wrappers/with_nav_update";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const TeachersMapping = () => {
  const [data, setData] = useState([]);
  const [madrasas, setMadrasas] = useState([]);
  const [selectedMadrasa, setSelectedMadrasa] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await new NetworkHandler().getAssignedStudents();
        setMadrasas(response.madrasas);
        // Auto-select the first madrasa if available
        if (response.madrasas && response.madrasas.length > 0) {
          setSelectedMadrasa(response.madrasas[0].name);
        }
      } catch (error) {
        console.error("Error fetching assigned students:", error);
      } finally {
        setDataLoading(false);
      }
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
    {
      field: "username",
      headerName: "Username",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
    { field: "name", headerName: "Name", width: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 200, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      flex: 0.8,
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
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {!dataLoading && (
        <Box sx={{ width: "100%", flexShrink: 0, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="madrasa-select-label">Filter by Madrasa</InputLabel>
            <Select
              labelId="madrasa-select-label"
              id="madrasa-select"
              value={selectedMadrasa}
              label="Filter by Madrasa"
              size="small"
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
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {dataLoading ? (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            autoHeight={false}
            sx={{
              height: "100%",
              width: "100%",
              flex: 1,
              minHeight: 0,
            }}
            loading={dataLoading}
            getRowId={(row) => row.id}
          />
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ minHeight: "400px" }}>
          <TableContainer>
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
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(TeachersMapping);
