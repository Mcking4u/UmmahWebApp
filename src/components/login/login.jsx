import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import logoImage from "/logo.svg"; // Import your logo image
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: "#333", // Set dark background color for the page
    minHeight: "100vh", // Ensure full height of the viewport
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorText: {
    color: "red",
    marginBottom: theme.spacing(1),
    textAlign: "left",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      // Perform login action or API call here
      setTimeout( () => {
        navigate("/");
      }, 3000 );
    } else {
     setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Done" || e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const navigate = useNavigate();

  return (
    <div className={classes.page}>
      <Card className={classes.card}>
        <CardContent>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <img src={logoImage} alt="Logo" className={classes.logo} />
          </Box>
          <Typography component="h1" variant="h5" align="center">
            Sign In
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email Address"
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
              className={classes.submit}
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
