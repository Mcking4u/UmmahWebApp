import Dashboard from "./dashboard";
import MasjidDetails from "./masjid_details";
import SalahTimings from "./salah_timings";
import Announcements from "./announcements";
import NavBar from "../nav/navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "../404/not_found";
import React from "react";
import NetworkHandler from "../../network/network_handler";

import {
  Dashboard as DashboardIcon,
  Mosque,
  Timeline,
  AnnouncementOutlined,
} from "@mui/icons-material";

const navLinks = [
  { path: "/masjid/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/masjid/details", label: "Masjid Details", icon: <Mosque /> },
  { path: "/masjid/salah-timings", label: "Salah Timings", icon: <Timeline /> },
  {
    path: "/masjid/announcements",
    label: "Announcements",
    icon: <AnnouncementOutlined />,
  },
];

const MasjidHome = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if (appToken === "" || appToken === undefined || appToken === null) {
      navigate("/login");
    }
    let responseData = localStorage.getItem(NetworkHandler.loginResponseKey);
    responseData = JSON.parse(responseData);
    let is_masjid_admin = responseData.is_masjid_admin;
    if(!is_masjid_admin){
      navigate("/login");
    }
  }, []);

  return (
    <NavBar navLinks={navLinks}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard route={navLinks[0].path} label={navLinks[0].label} />
          }
        />
        <Route
          path="/details"
          element={
            <MasjidDetails route={navLinks[1].path} label={navLinks[1].label} />
          }
        />
        <Route
          path="/salah-timings"
          element={
            <SalahTimings route={navLinks[2].path} label={navLinks[2].label} />
          }
        />
        <Route
          path="/announcements"
          element={
            <Announcements route={navLinks[3].path} label={navLinks[3].label} />
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </NavBar>
  );
};

export default MasjidHome;
