import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Routes, Route, } from "react-router-dom";

import LoginPage from "./components/login/login";
import MasjidHome from "./components/pages/masjid_home";
import NetworkHandler from "./network/network_handler";
import Dashboard from "./components/pages/dashboard";
import Home from "./components/pages/home";

function App() {


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/masjid/*" element={<MasjidHome />}
         
          />
      
        </Routes>

     
    </ThemeProvider>
  );
}

export default App;
