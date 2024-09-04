import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  MenuItem,
  Select,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Slide,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NetworkHandler, { host } from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import { Add, FileDownload, PlayArrow, Upload } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const VideoManager = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false); // Bulk upload dialog state
  const [newCategoryName, setNewCategoryName] = useState("");
  const xlsSampleDownloadUrl = host + "/IslamicLearning/api/download-sample";
  const [newVideoData, setNewVideoData] = useState({
    title: "",
    thumbnailUrl: "",
    videourl: "",
    pg_rating: "A",
    media_type: "video",
  });
  const [loading, setLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false); // Loading state for bulk upload
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [videoTouched, setVideoTouched] = useState({
    title: false,
    thumbnailUrl: false,
    videourl: false,
  });
  const [bulkUploadFile, setBulkUploadFile] = useState(null); // State to store the selected file

  const fetchData = async () => {
    const result = await new NetworkHandler().getIslamicLearningData();
    setData(result);
    if (selectedCategory === 0) {
      setSelectedCategory(result[0]?.id || 0);
    }
  };

  const handleDownloadSample = () => {
    window.location.href = xlsSampleDownloadUrl;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    setLoading(true);
    try {
      await new NetworkHandler().addIslamicLearningCategory(newCategoryName);
      await fetchData();
      setAddCategoryOpen(false);
      setNewCategoryName("");
      setCategoryTouched(false);
    } catch (error) {
      console.error("Failed to add category", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    setLoading(true);
    try {
      let payload = { id: selectedCategory, ...newVideoData };
      await new NetworkHandler().addIslamicLearningVideo(payload);
      await fetchData();
      setAddVideoOpen(false);
      setNewVideoData({
        title: "",
        thumbnailUrl: "",
        videourl: "",
        pg_rating: "A",
        media_type: "video",
      });
      setVideoTouched({
        title: false,
        thumbnailUrl: false,
        videourl: false,
      });
    } catch (error) {
      console.error("Failed to add video", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await new NetworkHandler().deleteIslamicLearningVideo(id);
      const result = await new NetworkHandler().getIslamicLearningData();
      setData(result);
      setSelectedCategory(result[0]?.id || 0);
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) return;

    setBulkUploadLoading(true);
    try {
      await new NetworkHandler().bulkUploadVideos(bulkUploadFile);
      await fetchData();
      setBulkUploadOpen(false);
      setBulkUploadFile(null);
    } catch (error) {
      console.error("Failed to upload videos", error);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const selectedVideos =
    data.find((category) => category.id === selectedCategory)?.videos || [];

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "thumbnail_url", headerName: "Thumbnail Url", flex: 1 },
    { field: "video_url", headerName: "Video Url", flex: 1 },
    { field: "pg_rating", headerName: "PG Rating", flex: 1 },
    { field: "media_type", headerName: "Media Type", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Box>
          <Typography variant="subtitle1">Select Category</Typography>
          <Select
            value={selectedCategory}
            size="small"
            onChange={handleCategoryChange}
            variant="outlined"
          >
            {data.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Button
            sx={{ mt: 2.5 }}
            startIcon={<Add />}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setAddCategoryOpen(true)}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Button
              size="small"
              startIcon={<PlayArrow />}
              variant="contained"
              color="primary"
              onClick={() => setAddVideoOpen(true)}
            >
              Add Video
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleDownloadSample}
            >
              Download Sample XLS
            </Button>

            <Button
              size="small"
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setBulkUploadOpen(true)} // Open bulk upload dialog
            >
              Bulk Upload
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            rows={selectedVideos}
            columns={columns}
            pageSize={5}
            autoHeight
          />
        </Grid>
      </Grid>

      <Dialog
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              setCategoryTouched(true);
            }}
            helperText={
              categoryTouched && !newCategoryName && "Category name is required"
            }
            error={categoryTouched && !newCategoryName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCategoryOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            color="primary"
            disabled={!newCategoryName || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addVideoOpen}
        onClose={() => setAddVideoOpen(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Video</DialogTitle>
        <DialogContent sx={{ maxWidth: 300 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newVideoData.title}
            onChange={(e) => {
              setNewVideoData({ ...newVideoData, title: e.target.value });
              setVideoTouched({ ...videoTouched, title: true });
            }}
            helperText={
              videoTouched.title && !newVideoData.title && "Title is required"
            }
            error={videoTouched.title && !newVideoData.title}
          />
          <TextField
            margin="dense"
            label="Thumbnail URL"
            type="text"
            fullWidth
            value={newVideoData.thumbnailUrl}
            onChange={(e) => {
              setNewVideoData({
                ...newVideoData,
                thumbnailUrl: e.target.value,
              });
              setVideoTouched({ ...videoTouched, thumbnailUrl: true });
            }}
            helperText={
              videoTouched.thumbnailUrl &&
              !newVideoData.thumbnailUrl &&
              "Thumbnail URL is required"
            }
            error={videoTouched.thumbnailUrl && !newVideoData.thumbnailUrl}
          />
          <TextField
            margin="dense"
            label="Video URL"
            type="text"
            fullWidth
            value={newVideoData.videourl}
            onChange={(e) => {
              setNewVideoData({ ...newVideoData, videourl: e.target.value });
              setVideoTouched({ ...videoTouched, videourl: true });
            }}
            helperText={
              videoTouched.videourl &&
              !newVideoData.videourl &&
              "Video URL is required"
            }
            error={videoTouched.videourl && !newVideoData.videourl}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              select
              label="PG Rating"
              value={newVideoData.pg_rating}
              onChange={(e) =>
                setNewVideoData({ ...newVideoData, pg_rating: e.target.value })
              }
              fullWidth
              margin="dense"
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="U">U</MenuItem>
            </TextField>
            <TextField
              select
              label="Media Type"
              value={newVideoData.media_type}
              onChange={(e) =>
                setNewVideoData({ ...newVideoData, media_type: e.target.value })
              }
              fullWidth
              margin="dense"
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="short">Short</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVideoOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddVideo}
            color="primary"
            disabled={
              !newVideoData.title ||
              !newVideoData.thumbnailUrl ||
              !newVideoData.videourl ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Bulk Upload Videos</DialogTitle>
        <DialogContent>
          <input
            accept=".xlsx"
            type="file"
            onChange={(e) => setBulkUploadFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUploadOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpload}
            color="primary"
            disabled={!bulkUploadFile || bulkUploadLoading}
          >
            {bulkUploadLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default withNavUpdate(VideoManager);
