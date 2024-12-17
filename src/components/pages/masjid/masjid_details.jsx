import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Box,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

function MasjidDetails() {
  useEffect(() => {
    // Fetch Masjid details on component mount
    const fetchMasjidDetails = async () => {
      try {
        let data = await new NetworkHandler().getMasjidProfile();
        data[0]["Password"] = "";
        setMasjidId(data[0].id);
        setMasjidDetails(data[0]);
      } catch (error) {
        console.error("Error fetching Masjid details:", error);
      }
    };

    fetchMasjidDetails();
  }, []);

  const [masjidDetails, setMasjidDetails] = useState({
    name: "",
    phone_number: "",
    email_address: "",
    address_street: "",
    address_city: "",
    address_postal_code: "",
    address_country: "",
    thumbnail_url: "",
    latitude: "",
    longitude: "",
    Password: "",
    donation_text: "", // New state for donation text
    clock_background: null,
    time_card_color: "#ffffff",
    time_card_text_color: "#000000",
    salah_card_color: "#ffffff",
    salah_card_text_color: "#000000",
    salah_card_active_color: "#4CAF51",
    salah_card_active_text_color: "#ffffff",
    time_remaining_card_color: "#FB7615",
    time_remaining_text_color: "#ffffff",
    clock_footer: "",
    clock_footer_text_color: "#000000",
  });

  const [masjidDetailsEditable, setMasjidDetailsEditable] = useState(false);
  const [masjidId, setMasjidId] = useState("");
  const navigate = useNavigate();
  const [contactPersonEditable, setContactPersonEditable] = useState(false);

  const handleEditClick = (section) => {
    if (section === "masjidDetails") {
      setMasjidDetailsEditable(true);
    } else if (section === "contactPerson") {
      setContactPersonEditable(true);
    }
  };

  const handleSubmitClick = async (section) => {
    if (section === "masjidDetails") {
      try {
        setMasjidDetailsEditable(false);
        setToastState({
          open: true,
          vertical: "top",
          horizontal: "right",
        });

        // Prepare the payload
        const payload = { ...masjidDetails };
        let clock_background = payload.clock_background;
        if (clock_background && !clock_background.startsWith("http")) {
          clock_background = clock_background.replace("data:", "").replace(/^.+,/, "");
          payload.clock_background = clock_background;
        }
        await new NetworkHandler().editMasjidProfile(payload);
      } catch (error) {
        alert("Error updating Masjid details:");
      }
    } else if (section === "contactPerson") {
      setContactPersonEditable(false);
      setToastState({
        open: true,
        vertical: "bottom",
        horizontal: "right",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMasjidDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDonationTextChange = (value) => {
    setMasjidDetails((prevDetails) => ({
      ...prevDetails,
      donation_text: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMasjidDetails(prev => ({
          ...prev,
          clock_background: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //   const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onerror = (error) => reject(error);
  //     reader.onload = () => {
  //       let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  //       resolve(base64String);
  //     };
  //   });
  // };

  const [toastState, setToastState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = toastState;

  return (
    <div>
      {/* Masjid Details Section */}
      <Box sx={{ display: "flex", gap: 3, marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Masjid Details
        </Typography>
        <Button
          variant="outlined"
          size="small"
          disabled={masjidId === ""}
          onClick={() => {
            navigate(`/masjid/issues/${masjidId}`)
          }}
          startIcon={<ErrorOutlineIcon />}
        >
          View Issues
        </Button>
      </Box>
      <Grid container spacing={2}>
        {[
          { label: "Masjid Name", name: "name" },
          { label: "Contact #", name: "phone_number" },
          { label: "Email", name: "email_address" },
          { label: "Address", name: "address_street" },
          { label: "City", name: "address_city" },
          { label: "Postal Code", name: "address_postal_code" },
          { label: "Country", name: "address_country" },
          { label: "Thumbnail", name: "thumbnail_url" },
          { label: "Latitude", name: "latitude" },
          { label: "Longitude", name: "longitude" },
          { label: "Password", name: "Password" },
        ].map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <TextField
              label={field.label}
              name={field.name}
              value={masjidDetails[field.name] || ""}
              onChange={handleInputChange}
              fullWidth
              disabled={!masjidDetailsEditable}
            />
          </Grid>
        ))}

        {/* Salat Clock Theme */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Salat Clock Theme
          </Typography>

          {/* Background Image Upload - Full Width Row */}
          <Grid container sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Clock Background</Typography>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
                disabled={!masjidDetailsEditable}
                style={{ display: 'none' }}
                id="clock-background-upload"
              />
              <label htmlFor="clock-background-upload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={!masjidDetailsEditable}
                >
                  Upload Image
                </Button>
              </label>
              {masjidDetails.clock_background && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={masjidDetails.clock_background}
                    alt="Clock Background"
                    style={{ maxWidth: '200px' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Color Pickers - New Row */}
          <Grid container spacing={2}>
            {[
              { label: "Time Card Color", name: "time_card_color" },
              { label: "Time Card Text Color", name: "time_card_text_color" },
              { label: "Salah Card Color", name: "salah_card_color" },
              { label: "Salah Card Text Color", name: "salah_card_text_color" },
              { label: "Salah Card Active Color", name: "salah_card_active_color" },
              { label: "Salah Card Active Text Color", name: "salah_card_active_text_color" },
              { label: "Time Remaining Card Color", name: "time_remaining_card_color" },
              { label: "Time Remaining Text Color", name: "time_remaining_text_color" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <Typography variant="subtitle2">{field.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    type="color"
                    value={masjidDetails[field.name]}
                    onChange={(e) => handleInputChange({
                      target: { name: field.name, value: e.target.value }
                    })}
                    disabled={!masjidDetailsEditable}
                    style={{ width: '50px', height: '50px' }}
                  />
                  <TextField
                    value={masjidDetails[field.name]}
                    onChange={(e) => handleInputChange({
                      target: { name: field.name, value: e.target.value }
                    })}
                    disabled={!masjidDetailsEditable}
                    size="small"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Clock Footer */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Clock Footer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Footer Text"
                name="clock_footer"
                value={masjidDetails.clock_footer || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={!masjidDetailsEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Footer Text Color</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  type="color"
                  value={masjidDetails.clock_footer_text_color}
                  onChange={(e) => handleInputChange({
                    target: { name: 'clock_footer_text_color', value: e.target.value }
                  })}
                  disabled={!masjidDetailsEditable}
                  style={{ width: '50px', height: '50px' }}
                />
                <TextField
                  value={masjidDetails.clock_footer_text_color}
                  onChange={(e) => handleInputChange({
                    target: { name: 'clock_footer_text_color', value: e.target.value }
                  })}
                  disabled={!masjidDetailsEditable}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Donation Text */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Donation Text
          </Typography>
          <ReactQuill
            value={masjidDetails.donation_text}
            onChange={handleDonationTextChange}
            // readOnly={!masjidDetailsEditable}
            // theme={masjidDetailsEditable ? 'snow' : 'bubble'}
            theme="snow"
          />

        </Grid>
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
      />
    </div>
  );
}

export default withNavUpdate(MasjidDetails);
