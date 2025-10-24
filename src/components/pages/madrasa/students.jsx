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
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import {
  ArrowDownward,
  Cancel,
  Check,
  RemoveRedEye,
  Close,
} from "@mui/icons-material";
import ExcelJS from "exceljs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Students = () => {
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
  const [info, setInfo] = useState({
    id: "",
    profile_picture: null,
    name: "",
    age: "", // Note: 'age' is not in your new API response, but 'dob' is
    gender: "",
    proficiency: "",
    parent_name: "",
    emergency_contact: "",
    enrolled_comment: "",
    dob: "", // Added dob to info state
    spouse_contact: "", // Added spouse_contact to info state
  });
  const [showInfo, setShowInfo] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  async function fetchData() {
    try {
      setDataLoading(true);
      const response = await new NetworkHandler().getMadrasaStudents();
      setMadrasas(response.madrasas);

      // CHANGED: Set selectedMadrasa safely
      if (response.madrasas && response.madrasas.length > 0) {
        setSelectedMadrasa(response.madrasas[0].name);
      } else {
        setSelectedMadrasa("");
      }

      // CHANGED: Use the new 'students' array.
      // We assume this list represents the "completed" students
      // as it's the only list provided and the DataGrid shows 'completedRows'.
      const allCompletedEnrollments = response.madrasas.flatMap((madrasa) =>
        madrasa.students.map((student) => ({
          ...student,
          // We must add 'enrolled_madrasa' so the filter can work
          enrolled_madrasa: { name: madrasa.name, id: madrasa.id },
        }))
      );

      // CHANGED: The old lists ('pending_enrolls', 'rejected') are no longer in the API.
      // We set them to empty arrays.
      setEnrollments([]);
      setCompletedEnrollments(allCompletedEnrollments);
      setRejectedEnrollments([]);
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

    // This filter now works because we added 'enrolled_madrasa' in fetchData
    const filteredCompleted = completedEnrollments.filter(
      (enrollment) => enrollment.enrolled_madrasa.name === selectedMadrasa
    );
    setFilteredCompletedEnrollments(filteredCompleted);

    // This 'allEnrollments' state is used by the 'Approve' dialog.
    // Since 'enrollments' is empty, it will just contain completed students.
    // The 'Approve' dialog logic will likely fail if ever called,
    // but the button to call it is not rendered in 'completedColumns'.
    setAllEnrollments([...filtered, ...filteredCompleted]);

    const filteredRejected = rejectedEnrollments.filter(
      (enrollment) => enrollment.enrolled_madrasa.name === selectedMadrasa
    );
    setFilteredRejectedEnrollments(filteredRejected);
  }, [
    selectedMadrasa,
    enrollments,
    completedEnrollments,
    rejectedEnrollments,
    // 'madrasas' dependency was missing, but it's okay
  ]);

  const handleMadrasaChange = (event) => {
    setSelectedMadrasa(event.target.value);
  };

  // --- All dialog handlers (handleOpenApproveDialog, etc.) remain unchanged ---
  // They are not triggered by the 'completedColumns' so they don't need to be fixed
  // unless you plan to show pending/rejected students again.
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

    if (
      sessions.length !=
      allRows.find((row) => row.id === selectedStudentId)?.sessions.length
    ) {
      alert("Please select teachers");
      return;
    }
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

  // This 'columns' definition is for pending students (which are no longer loaded)
  // It is not used by the DataGrid, so it's fine to leave as is.
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

  // This is the 'columns' definition used by the DataGrid. It's correct.
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
    // {
    //   field: "approve",
    //   headerName: "Reassign",
    //   renderCell: (params) => (
    //     <IconButton
    //       color="primary"
    //       onClick={() => handleOpenApproveDialog(params.row.id)}
    //     >
    //       <ReplayIcon />
    //     </IconButton>
    //   ),
    //   width: 150,
    //   flex: 0.5,
    // },
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

  // This 'rejectedColumns' definition is not used.
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

  // This 'rows' variable is not used by the DataGrid.
  const rows = filteredEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions,
    enrollment: enrollment,
  }));

  // This 'allRows' variable is used by the 'Approve' dialog.
  // It will only contain completed students, so it's missing 'program' and 'sessions'.
  // This part will break if the 'Approve' dialog is ever opened.
  const allRows = allEnrollments.map((enrollment) => ({
    id: enrollment.id,
    // CHANGED: Add safety checks
    name:
      enrollment.name +
      (enrollment.program ? " - " + enrollment.program.name : ""),
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    sessions: enrollment.sessions || [], // CHANGED: Add safety check
    enrollment: enrollment,
  }));

  // This IS used by the DataGrid.
  const completedRows = filteredCompletedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    // CHANGED: The 'program' object no longer exists on the student.
    name: enrollment.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    // status: enrollment.status, // 'status' is not in the new API response
    enrollment: enrollment, // This passes the full student object to the 'More Info' dialog
  }));

  // This 'rejectedRows' variable is not used.
  const rejectedRows = filteredRejectedEnrollments.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.name + " - " + enrollment.program.name,
    parent_name: enrollment.parent_name,
    emergency_contact: enrollment.emergency_contact,
    reason: enrollment.enrolled_comment,
    enrollment: enrollment,
  }));

  // This 'onExport' function looks correct and already matches your new API.
  const onExport = async () => {
    if (
      completedEnrollments === null ||
      completedEnrollments === undefined ||
      completedEnrollments.length <= 0
    ) {
      return;
    }
    const exportList = [...completedEnrollments];
    const filteredExportList = exportList.map((item) => ({
      name: item.name || "N/A",
      profile_picture: item.profile_picture || "N/A",
      dob: item.dob || "N/A",
      gender: item.gender || "N/A",
      proficiency: item.proficiency || "N/A",
      parent_name: item.parent_name || "N/A",
      spouse_contact: item.spouse_contact || "N/A",
      emergency_contact: item.emergency_contact || "N/A",
      enrolled_comment: item.enrolled_comment || "N/A",
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Set column headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Profile Picture", key: "profile_picture", width: 20 },
      { header: "DOB", key: "dob", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Proficiency", key: "proficiency", width: 20 },
      { header: "Parent Name", key: "parent_name", width: 25 },
      { header: "Spouse Contact", key: "spouse_contact", width: 20 },
      { header: "Emergency Contact", key: "emergency_contact", width: 20 },
      { header: "Enrolled Comment", key: "enrolled_comment", width: 30 },
    ];

    // Add data rows
    worksheet.addRows(filteredExportList);

    // Save the workbook to a file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_data.xlsx";
    link.click();
  };

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="madrasa-select-label">
                Filter by Madrasa
              </InputLabel>
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

            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onExport}
                endIcon={<ArrowDownward />}
              >
                Export
              </Button>
            </Box>
          </Box>
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
          // This DataGrid is correctly configured to show
          // 'completedRows' and 'completedColumns'
          <DataGrid
            rows={completedRows}
            columns={completedColumns}
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
            disableSelectionOnClick
          />
        )}
      </Box>

      {/* This dialog is for 'pending' students and will break if opened,
          but the button to open it is not rendered. */}
      <Dialog
        open={openApproveDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Assign Teachers
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
              ?.sessions.map((session) => (
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

      {/* This 'More Info' dialog looks correct and matches your new API. */}
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

      {/* This dialog is for 'pending' students and will not be opened. */}
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
    </Box>
  );
};
export default withNavUpdate(Students);
