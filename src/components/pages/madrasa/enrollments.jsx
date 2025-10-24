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
  CircularProgress,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import {
  Cancel,
  Check,
  RemoveRedEye,
  School,
  PersonRemove,
  Close,
} from "@mui/icons-material";
import ReplayIcon from "@mui/icons-material/Replay";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
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
  const [info, setInfo] = useState({
    id: "",
    profile_picture: null,
    name: "",
    age: "",
    gender: "",
    proficiency: "",
    parent_name: "",
    emergency_contact: "",
    enrolled_comment: "",
  });
  const [showInfo, setShowInfo] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  async function fetchData() {
    try {
      setDataLoading(true);
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
      setPrograms(res.programs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
  };
  const handleInfoClose = () => {
    setShowInfo(false);
  };

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
    {
      field: "de_enroll",
      headerName: "DeEnroll",
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleOpenDeEnrollDialog(params.row.id)}
        >
          <PersonRemove />
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
      program_id: enrollment.program.id,
    };
    setReassignProgram(data);
  };
  const handleReassignProgramClose = () => {
    setShowReassignProgram(false);
    setReassignLoading(false);
  };
  const [reassignLoading, setReassignLoading] = useState(false);
  const [openDeEnrollDialog, setOpenDeEnrollDialog] = useState(false);
  const [selectedDeEnrollStudentId, setSelectedDeEnrollStudentId] =
    useState(null);

  const handleReassign = async () => {
    setReassignLoading(true);

    await new NetworkHandler().changeProgram(reassignProgram);
    fetchData();

    handleReassignProgramClose();
  };

  const handleOpenDeEnrollDialog = (studentId) => {
    setSelectedDeEnrollStudentId(studentId);
    setOpenDeEnrollDialog(true);
  };

  const handleCloseDeEnrollDialog = () => {
    setOpenDeEnrollDialog(false);
    setSelectedDeEnrollStudentId(null);
  };

  const handleDeEnroll = async () => {
    try {
      await new NetworkHandler().deEnrollStudent(selectedDeEnrollStudentId);
      handleCloseDeEnrollDialog();
      fetchData();
    } catch (error) {
      console.error("Error de-enrolling student:", error);
    }
  };

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
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
  }));

  const allRows = allEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
    enrollment: enrollment,
  }));

  const completedRows = filteredCompletedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    status: enrollment.status,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
  }));

  const rejectedRows = filteredRejectedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    reason: enrollment.enrolled_comment,
    enrollment: enrollment,
    program_sessions: enrollment.program_sessions,
    program: enrollment.program,
  }));

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
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="madrasa-select-label">Filter by Madrasa</InputLabel>
            <Select
              labelId="madrasa-select-label"
              id="madrasa-select"
              value={selectedMadrasa}
              onChange={handleMadrasaChange}
              label="Filter by Madrasa"
              size="small"
            >
              {madrasas.map((madrasa) => (
                <MenuItem key={madrasa.name} value={madrasa.name}>
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
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
            >
              <Tab
                label={`Pending Enrollments (${rows.length})`}
                sx={{ textTransform: "none" }}
              />
              <Tab
                label={`Completed Enrollments (${completedRows.length})`}
                sx={{ textTransform: "none" }}
              />
              <Tab
                label={`Rejected Enrollments (${rejectedRows.length})`}
                sx={{ textTransform: "none" }}
              />
            </Tabs>

            <Box sx={{ flex: 1, minHeight: 0, mt: 2 }}>
              {activeTab === 0 && (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  autoHeight={false}
                  sx={{
                    height: "100%",
                    width: "100%",
                    minHeight: 0,
                  }}
                  loading={dataLoading}
                  disableSelectionOnClick
                />
              )}

              {activeTab === 1 && (
                <DataGrid
                  rows={completedRows}
                  columns={completedColumns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  autoHeight={false}
                  sx={{
                    height: "100%",
                    width: "100%",
                    minHeight: 0,
                  }}
                  loading={dataLoading}
                  disableSelectionOnClick
                />
              )}

              {activeTab === 2 && (
                <DataGrid
                  rows={rejectedRows}
                  columns={rejectedColumns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  autoHeight={false}
                  sx={{
                    height: "100%",
                    width: "100%",
                    minHeight: 0,
                  }}
                  loading={dataLoading}
                  disableSelectionOnClick
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={openApproveDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {allRows.find((row) => row.id === selectedStudentId) && (
            <>
              Assign Teachers for program -{" "}
              {allRows.find((row) => row.id === selectedStudentId).program.name}
            </>
          )}
          <IconButton
            aria-label="close"
            onClick={handleCloseApproveDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: "400px" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {allRows
              .find((row) => row.id === selectedStudentId)
              ?.program_sessions.map((session) => (
                <Box key={session.id}>
                  <Typography component="div" variant="h6" sx={{ mb: 1 }}>
                    {session.name}
                  </Typography>
                  <FormControl fullWidth>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveLoading}
            color="primary"
            startIcon={approveLoading ? <CircularProgress size={20} /> : null}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showInfo}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleInfoClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          More Info
          <IconButton
            aria-label="close"
            onClick={handleInfoClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} align="start">
              <Avatar
                alt={info.name}
                src={info.profile_picture || "/placeholder.png"} // Provide a placeholder if no profile picture
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Name:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>DOB:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.dob}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Gender:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.gender}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Proficiency:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.proficiency}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Father Name:</strong>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1">{info.parent_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Father Contact:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {info.spouse_contact || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Emergency Contact:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{info.emergency_contact}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Enrolled Comment:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {info.enrolled_comment || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showReassignProgram}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReassignProgramClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reassign Program
          <IconButton
            aria-label="close"
            onClick={handleReassignProgramClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Program</InputLabel>
              <Select
                value={reassignProgram.program_id}
                label="Select Program"
                onChange={(e) => {
                  const reassignProgram_ = { ...reassignProgram };
                  reassignProgram_.program_id = e.target.value;
                  setReassignProgram(reassignProgram_);
                }}
              >
                {filteredPrograms.length > 0 &&
                  filteredPrograms.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReassignProgramClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleReassign}
            disabled={reassignLoading}
            color="primary"
            startIcon={reassignLoading ? <CircularProgress size={20} /> : null}
          >
            Reassign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRejectDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reject Enrollment
          <IconButton
            aria-label="close"
            onClick={handleCloseRejectDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Reason for Rejection"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Stack>
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

      <Dialog
        open={openDeEnrollDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeEnrollDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm De-Enrollment
          <IconButton
            aria-label="close"
            onClick={handleCloseDeEnrollDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <Typography>
            Are you sure you want to de-enroll this student? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeEnrollDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeEnroll} color="error">
            De-Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withNavUpdate(EnrollmentDataGrid);
