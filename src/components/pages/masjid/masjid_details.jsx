import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";

function MasjidDetails() {
  useEffect(() => {
    // Fetch Masjid details on component mount
    const fetchMasjidDetails = async () => {
      try {
        let data = await new NetworkHandler().getMasjidProfile();
        data[0]["Password"] = "";
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
    donation_thumbnail: "", // New state for donation thumbnail
  });

  const [masjidDetailsEditable, setMasjidDetailsEditable] = useState(false);
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
        if (!masjidDetails.donation_thumbnail || masjidDetails.donation_thumbnail.startsWith("http")) {
          delete payload.donation_thumbnail;
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertToBase64(file);
      setMasjidDetails((prevDetails) => ({
        ...prevDetails,
        donation_thumbnail: base64String,
      }));
    }
  };

  const [toastState, setToastState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = toastState;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = () => {
        let base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        resolve(base64String);
      };
    });
  };

  return (
    <div>
      {/* Masjid Details Section */}
      <Typography variant="h5" gutterBottom>
        Masjid Details
      </Typography>
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

        {/* Donation Thumbnail */}
        <Grid item xs={12} sm={6}>
          {masjidDetails.donation_thumbnail ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt="Donation Thumbnail"
                // src={masjidDetails.donation_thumbnail}
                src={masjidDetails.donation_thumbnail.startsWith("http") ? `${masjidDetails.donation_thumbnail}` : `data:image/jpeg;base64,${masjidDetails.donation_thumbnail}`}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                disabled={!masjidDetailsEditable}
              >
                Edit
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
          ) : (
            <Button
              variant="outlined"
              component="label"
              disabled={!masjidDetailsEditable}
            >
              Add Donation Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}
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
