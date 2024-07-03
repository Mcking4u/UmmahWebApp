import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateNavState } from "../../redux/navSlice";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import SlideTransition from "../animation/slide_transition";

function MasjidDetails() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      updateNavState({ headerText: "Masjid Details", activeLink: "/details" })
    );
  }, []);

  const [masjidDetailsEditable, setMasjidDetailsEditable] = useState(false);
  const [contactPersonEditable, setContactPersonEditable] = useState(false);

  const handleEditClick = (section) => {
    if (section === "masjidDetails") {
      setMasjidDetailsEditable(true);
    } else if (section === "contactPerson") {
      setContactPersonEditable(true);
    }
  };

  const handleSubmitClick = (section) => {
    // Handle form submission logic for the respective section

    if (section === "masjidDetails") {
      setMasjidDetailsEditable(false);
      setToastState({
        open: true,
        vertical: "top",
        horizontal: "right",
      });
    } else if (section === "contactPerson") {
      setContactPersonEditable(false);
      setToastState({
        open: true,
        vertical: "bottom",
        horizontal: "right",
      });
    }
  };

  const [toastState, setToastState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = toastState;

  return (
    <div>
      {/* Masjid Details Section */}
      <Typography variant="h5" gutterBottom>
        Masjid Details
      </Typography>
      <Grid container spacing={2}>
        {[
          "Masjid Name",
          "Contact #",
          "Email",
          "Address",
          "City",
          "Postal Code",
          "Country",
          "Thumbnail",
          "Latitude",
          "Longitude",
        ].map((label) => (
          <Grid item xs={12} sm={6} key={label}>
            <TextField
              label={label}
              fullWidth
              disabled={!masjidDetailsEditable}
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="outlined"
        onClick={() => handleEditClick("masjidDetails")}
        disabled={masjidDetailsEditable}
        sx={{ mt: 2 }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        onClick={() => handleSubmitClick("masjidDetails")}
        disabled={!masjidDetailsEditable}
        sx={{ mt: 2, ml: 1 }}
      >
        Submit
      </Button>

      {/* Contact Person Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Contact Person
      </Typography>
      <Grid container spacing={2}>
        {["Contact Name", "Contact #", "Email"].map((label) => (
          <Grid item xs={12} sm={6} key={label}>
            <TextField
              label={label}
              fullWidth
              disabled={!contactPersonEditable}
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="outlined"
        onClick={() => handleEditClick("contactPerson")}
        disabled={contactPersonEditable}
        sx={{ mt: 2 }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        onClick={() => handleSubmitClick("contactPerson")}
        disabled={!contactPersonEditable}
        sx={{ mt: 2, ml: 1 }}
      >
        Submit
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        message="Changes Saved!"
        anchorOrigin={{ vertical, horizontal }}
        onClose={() =>
          setToastState({
            open: false,
            vertical: "top",
            horizontal: "right",
          })
        }
      >
        {/* <Alert severity="success">Changes Saved!</Alert> */}
      </Snackbar>
    </div>
  );
}

export default () => (
  <SlideTransition>
    <MasjidDetails />
  </SlideTransition>
);
