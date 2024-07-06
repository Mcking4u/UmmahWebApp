import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import logoImage from "/logo.svg"; // Import your logo image
import { useNavigate } from "react-router-dom";
import NetworkHandler from "../../network/network_handler";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const networkHandler = new NetworkHandler();

  const validateForm = () => {
    let isValid = true;

    // // Email validation using regex
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setEmailError("Enter a valid email address");
    //   isValid = false;
    // } else {
    //   setEmailError("");
    // }
    if(email.length < 1){
      setEmailError("Please enter a valid username")
    }
    else {
      setEmailError("");
    }

    // Password minimum length validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      try {
        const response = await networkHandler.login(email, password);
        setLoading(false);
        if(response.status){
          localStorage.setItem(NetworkHandler.loginTokenKey, response.token); 
          navigate("/"); 

          //implement this later
          // let is_masjid_admin = response.is_masjid_admin;
          // let is_super_user = response.is_super_user;
          // let is_ummah_admin = response.is_ummah_admin;
        }
        else {
          setPasswordError(response.message);
        }
       
      } catch (error) {
        setLoading(false);
        alert("Login failed, please try again");
      }
    } else {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Done" || e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#333",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 4, color: "primary" }}>
        <CardContent>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <img
              src={logoImage}
              alt="Logo"
              style={{ width: 80, height: "auto", maxWidth: 80, mb: 2 }}
            />
          </Box>
          <Typography component="h1" variant="h5" align="center">
            Sign In
          </Typography>
          <form
            style={{ width: "100%", mt: 1 }}
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(emailError)}
              helperText={emailError}
              onKeyDown={handleKeyDown}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError}
              onKeyDown={handleKeyDown}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress /> : " Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
