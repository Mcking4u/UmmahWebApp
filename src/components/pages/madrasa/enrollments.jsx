import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Slide,
  Typography,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import { Cancel, Check, RemoveRedEye, School } from "@mui/icons-material";
import ReplayIcon from "@mui/icons-material/Replay";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EnrollmentDataGrid = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [completedEnrollments, setCompletedEnrollments] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [filteredCompletedEnrollments, setFilteredCompletedEnrollments] =
    useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [filteredRejectedEnrollments, setFilteredRejectedEnrollments] =
    useState([]);
  const [madrasas, setMadrasas] = useState([]);
  const [selectedMadrasa, setSelectedMadrasa] = useState("");
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [approveLoading, setAppRoveLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [info, setInfo] = useState(
    {
      id: "",
      profile_picture: null,
      name: "",
      age: "",
      gender: "",
      proficiency: "",
      parent_name: "",
      emergency_contact: "",
      enrolled_comment: "",
    }
  );
  const [showInfo, setShowInfo] = useState(false);


  async function fetchData() {
    try {
      const response = await new NetworkHandler().getMadrasaEnrollments();
      setMadrasas(response.madrasas);
      setSelectedMadrasa(response.madrasas[0].name);
      const allEnrollments = response.madrasas.flatMap(
        (madrasa) => madrasa.pending_enrolls
      );
      const allCompletedEnrollments = response.madrasas.flatMap(
        (madrasa) => madrasa.completed
      );
      const allRejectedEnrollments = response.madrasas.flatMap(
        (madrasa) => madrasa.rejected
      );
      setEnrollments(allEnrollments);
      setCompletedEnrollments(allCompletedEnrollments);
      setRejectedEnrollments(allRejectedEnrollments);
      const res = await new NetworkHandler().getPrograms();
      setPrograms(res.programs)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = enrollments.filter(
      (enrollment) => enrollment.enrolled_madrasa.name === selectedMadrasa
    );
    setFilteredEnrollments(filtered);
    const filteredCompleted = completedEnrollments.filter(
      (enrollment) => enrollment.enrolled_madrasa.name === selectedMadrasa
    );
    setFilteredCompletedEnrollments(filteredCompleted);
    setAllEnrollments([...filtered, ...filteredCompleted]);
    const filteredRejected = rejectedEnrollments.filter(
      (enrollment) => enrollment.enrolled_madrasa.name === selectedMadrasa
    );
    setFilteredRejectedEnrollments(filteredRejected);

    const filteredPrograms_ = programs.filter(
      (program) => program.madrasa.name === selectedMadrasa
    );
    setFilteredPrograms(filteredPrograms_);
  }, [
    selectedMadrasa,
    enrollments,
    completedEnrollments,
    rejectedEnrollments,
    madrasas,
    programs,
  ]);

  const handleMadrasaChange = (event) => {
    setSelectedMadrasa(event.target.value);
  };

  const handleOpenApproveDialog = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedSessions({}); // Reset selected sessions
    setOpenApproveDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedSessions({});
  };

  const handleOpenRejectDialog = (studentId) => {
    setSelectedStudentId(studentId);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectReason("");
  };

  const handleSessionTeacherChange = (sessionId, teacherId) => {
    setSelectedSessions((prev) => ({
      ...prev,
      [sessionId]: teacherId,
    }));
  };

  const handleApprove = async () => {
    const sessions = Object.keys(selectedSessions).map((sessionId) => ({
      session_id: sessionId,
      teacher_id: selectedSessions[sessionId],
    }));

    // if (sessions.length != allRows
    //   .find((row) => row.id === selectedStudentId)
    //   ?.sessions.length) {
    //   alert("Please select teachers");
    //   return;
    // }
    setAppRoveLoading(true);

    const assignmentData = {
      student_id: selectedStudentId,
      sessions,
    };


    try {
      await new NetworkHandler().assignTeacher(assignmentData);
      handleCloseApproveDialog();
      fetchData();
    } catch (error) {
      setAppRoveLoading(false);

      console.error("Error assigning teachers:", error);
    }
    setAppRoveLoading(false);
  };

  const handleReject = async () => {
    const rejectionData = {
      student_id: selectedStudentId,
      comment: rejectReason,
    };
    try {
      await new NetworkHandler().rejectEnrollment(rejectionData);
      handleCloseRejectDialog();
      fetchData();
    } catch (error) {
      console.error("Error rejecting enrollment:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Student Name",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
    { field: "parent_name", headerName: "Parent Name", width: 150, flex: 1 },
    {
      field: "emergency_contact",
      headerName: "Contact Number",
      width: 150,
      flex: 1,
    },
    {
      field: "approve",
      headerName: "Approve",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleOpenApproveDialog(params.row.id)}
        >
          <Check />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
    {
      field: "reject",
      headerName: "Reject",
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleOpenRejectDialog(params.row.id)}
        >
          <Cancel />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
    {
      field: "view_more",
      headerName: "More Info",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => showEntollment(params.row.enrollment)}
        >
          <RemoveRedEye />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
  ];

  const showEntollment = (enrollment) => {
    setShowInfo(true);
    setInfo(enrollment);
  }
  const handleInfoClose = () => {
    setShowInfo(false);
  }

  const completedColumns = [
    {
      field: "name",
      headerName: "Student Name",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
    { field: "parent_name", headerName: "Parent Name", width: 150, flex: 1 },
    {
      field: "emergency_contact",
      headerName: "Contact Number",
      width: 150,
      flex: 1,
    },
    {
      field: "approve",
      headerName: "Reassign",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleOpenApproveDialog(params.row.id)}
        >
          <ReplayIcon />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
    {
      field: "view_more",
      headerName: "More Info",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => showEntollment(params.row.enrollment)}
        >
          <RemoveRedEye />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
    {
      field: "change_program",
      headerName: "Change Program",
      renderCell: (params) => (
        <IconButton
          color="primary"
          disabled={filteredPrograms.length <= 0}
          onClick={() => showReassign(params.row.enrollment)}
        >
          <School />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
  ];


  const [showReassignProgram, setShowReassignProgram] = useState(false);
  const [reassignProgram, setReassignProgram] = useState({
    student_id: 1,
    program_id: 1,
  });

  const showReassign = (enrollment) => {
    setShowReassignProgram(true);
    const data = {
      student_id: enrollment.id,
      program_id: enrollment.program.id
    }
    setReassignProgram(data);
  }
  const handleReassignProgramClose = () => {
    setShowReassignProgram(false);
    setReassignLoading(false);
  }
  const [reassignLoading, setReassignLoading] = useState(false);

  const handleReassign = async () => {
    setReassignLoading(true);

    await new NetworkHandler().changeProgram(reassignProgram);
    fetchData();

    handleReassignProgramClose()

  }


  const rejectedColumns = [
    {
      field: "name",
      headerName: "Student Name",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
    { field: "parent_name", headerName: "Parent Name", width: 150, flex: 1 },
    {
      field: "emergency_contact",
      headerName: "Contact Number",
      width: 150,
      flex: 1,
    },
    {
      field: "reason",
      headerName: "Reason for rejection",
      width: 150,
      flex: 2,
    },
    {
      field: "view_more",
      headerName: "More Info",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => showEntollment(params.row.enrollment)}
        >
          <RemoveRedEye />
        </IconButton>
      ),
      width: 150,
      flex: 0.5,
    },
  ];

  const rows = filteredEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
  }));

  const allRows = allEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
    enrollment: enrollment,

  }));

  const completedRows = filteredCompletedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    status: enrollment.status,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,

  }));

  const rejectedRows = filteredRejectedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    reason: enrollment.enrolled_comment,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
  }));

  return (
    <div>
      <FormControl
        variant="outlined"
        style={{ marginBottom: "20px", minWidth: 200 }}
      >
        <InputLabel id="madrasa-select-label">Filter by Madrasa</InputLabel>
        <Select
          labelId="madrasa-select-label"
          id="madrasa-select"
          value={selectedMadrasa}
          onChange={handleMadrasaChange}
          label="Filter by Madrasa"
        >
          {madrasas.map((madrasa) => (
            <MenuItem key={madrasa.name} value={madrasa.name}>
              {madrasa.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>

      <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
        <DataGrid
          rows={completedRows}
          columns={completedColumns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>

      <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
        <DataGrid
          rows={rejectedRows}
          columns={rejectedColumns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>

      <Dialog
        open={openApproveDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseApproveDialog}
      >
        {allRows
          .find((row) => row.id === selectedStudentId) && (
            <DialogTitle>Assign Teachers for program - {allRows
              .find((row) => row.id === selectedStudentId).program.name} </DialogTitle>
          )}

        <DialogContent
          sx={{ minWidth: 400 }}
        >
          {allRows
            .find((row) => row.id === selectedStudentId)
            ?.program_sessions.map((session) => (
              <Box key={session.id} >
                <Typography component="div" variant="h6" >{session.name}</Typography>
                <FormControl fullWidth margin="normal" sx={{ mt: 1, pt: 0 }}>
                  <InputLabel>Select teacher for {session.name}</InputLabel>
                  <Select
                    value={selectedSessions[session.id] || ""}
                    label={`Select teacher for ${session.name}`}
                    onChange={(e) =>
                      handleSessionTeacherChange(session.id, e.target.value)
                    }
                  >
                    {session.teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.profile.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleApprove}
            disabled={approveLoading}
            color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={showInfo}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleInfoClose}
      >
        <DialogTitle>More Info</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} align="start">
              <Avatar
                alt={info.name}
                src={info.profile_picture || '/placeholder.png'} // Provide a placeholder if no profile picture
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Name:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>DOB:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.dob}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Gender:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.gender}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Proficiency:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.proficiency}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Father Name:</strong></Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1">{info.parent_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Father Contact:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.spouse_contact || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Emergency Contact:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.emergency_contact}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1"><strong>Enrolled Comment:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.enrolled_comment || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showReassignProgram}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReassignProgramClose}
      >
        <DialogTitle>Reassign Program</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel >Select Program</InputLabel>
            <Select

              value={reassignProgram.program_id}
              label='Select Program'
              onChange={(e) => {
                const reassignProgram_ = { ...reassignProgram }
                reassignProgram_.program_id = e.target.value;
                setReassignProgram(reassignProgram_);
              }
              }
            >

              {filteredPrograms.length > 0 && (
                filteredPrograms.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReassignProgramClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleReassign}
            disabled={reassignLoading}
            color="primary">
            Reassign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRejectDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle>Reject Enrollment</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Rejection"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="primary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withNavUpdate(EnrollmentDataGrid);
