import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./components/login/login";
import Home from "./components/pages/home";
import NetworkHandler from "./network/network_handler";

function App() {
  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if(appToken === "" || appToken === undefined || appToken === null){
      navigate("/login");
    }
  }, [])

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
