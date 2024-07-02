// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    // h1: {
    //   fontSize: '1.5rem',
    // },
  },
  palette: {
    primary: {
      main: "#019B8F",
    },
    secondary: {
      main: "#dc004e",
    },
  },

  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "15px",
          fontWeight: "300",
        },
        secondary: {
          fontWeight: "300",
          fontSize: "13px",
        },
      },
    },
  },

  // Add other customizations here
});

export default theme;
