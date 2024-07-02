import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/login/login";
import Home from "./components/pages/home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<Home />}
         
          />
      
        </Routes>

     
    </ThemeProvider>
  );
}

export default App;
