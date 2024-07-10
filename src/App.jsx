import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/login/login";
import MasjidHome from "./components/pages/masjid/masjid_home";
import Home from "./components/pages/home";
import MadrasaHome from "./components/pages/madrasa/madrasa_home";
import AdminHome from "./components/pages/admin/admin_home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/masjid/*" element={<MasjidHome />} />
        <Route path="/admin/*" element={<AdminHome />} />
        <Route path="/madrasa/*" element={<MadrasaHome />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
