import { Routes, Route, useNavigate } from "react-router-dom";
import React from "react";

import {
  AnnouncementOutlined,
  Dashboard as DashboardIcon,
  ListOutlined,
  Mosque,
  Person2,
} from "@mui/icons-material";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import NotFoundPage from "../../404/not_found";
import NavBar from "../../nav/navbar";
import Dashboard from "../dashboard";
import MyMadrasas from "./my_madrasas";
import Teachers from "./teachers";
import Announcements from "./announcements";
import Enrollments from "./enrollments";
import Mapping from "./mapping";
import NetworkHandler from "../../../network/network_handler";

const navLinks = [
  { path: "/madrasa/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/madrasa/details", label: "My Madrasas", icon: <Mosque /> },
  { path: "/madrasa/teachers", label: "Teachers", icon: <Person2 /> },
  {
    path: "/madrasa/announcements",
    label: "Announcements",
    icon: <AnnouncementOutlined />,
  },
  {
    path: "/madrasa/enrollments",
    label: "Enrollments",
    icon: <ListOutlined />,
  },
  {
    path: "/madrasa/mapping",
    label: "Teachers Mapping",
    icon: <GraphicEqIcon />,
  },
];

const MadrasaHome = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if (appToken === "" || appToken === undefined || appToken === null) {
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
            <MyMadrasas
              route={navLinks[1].path}
              label={navLinks[1].label}
            />
          }
        />
        <Route
          path="/teachers"
          element={
            <Teachers route={navLinks[2].path} label={navLinks[2].label} />
          }
        />
        <Route
          path="/announcements"
          element={
            <Announcements route={navLinks[3].path} label={navLinks[3].label} />
          }
        />

        <Route
          path="/enrollments"
          element={
            <Enrollments route={navLinks[4].path} label={navLinks[4].label} />
          }
        />

        <Route
          path="/mapping"
          element={
            <Mapping route={navLinks[5].path} label={navLinks[5].label} />
          }
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </NavBar>
  );
};

export default MadrasaHome;
