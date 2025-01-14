import { Routes, Route, useNavigate } from "react-router-dom";
import React from "react";

import {
  AnnouncementOutlined,
  Dashboard as DashboardIcon,
  ListOutlined,
  Mosque,
  Person2,
  People,
  Timeline,
  School,
  Payment,
} from "@mui/icons-material";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import NotFoundPage from "../../404/not_found";
import NavBar from "../../nav/navbar";
import MyMadrasas from "./my_madrasas";
import Teachers from "./teachers";
import Announcements from "./announcements";
import Enrollments from "./enrollments";
import Mapping from "./mapping";
import NetworkHandler from "../../../network/network_handler";
import Dashboard from "./madrasa_dashboard";
import Students from "./students";
import Sessions from "./sessions";
import Programs from "./programs";
import Payments from "./payments";

const navLinks = [
  { path: "/madrasa/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/madrasa/details", label: "My Madrasas", icon: <Mosque /> },
  { path: "/madrasa/programs", label: "Programs", icon: <School /> },
  { path: "/madrasa/teachers", label: "Teachers", icon: <Person2 /> },
  { path: "/madrasa/sessions", label: "Sessions", icon: <Timeline /> },
  { path: "/madrasa/students", label: "Students", icon: <People /> },
  { path: "/madrasa/mapping", label: "Teachers Mapping", icon: <GraphicEqIcon /> },
  { path: "/madrasa/payments", label: "Payments", icon: <Payment /> },
  { path: "/madrasa/announcements", label: "Announcements", icon: <AnnouncementOutlined /> },
  { path: "/madrasa/enrollments", label: "Enrollments", icon: <ListOutlined /> },
];

const MadrasaHome = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if (appToken === "" || appToken === undefined || appToken === null) {
      navigate("/login");
    }
    let responseData = localStorage.getItem(NetworkHandler.loginResponseKey);
    responseData = JSON.parse(responseData);
    let is_ummah_admin = responseData.is_ummah_admin;
    if (!is_ummah_admin) {
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
            <MyMadrasas route={navLinks[1].path} label={navLinks[1].label} />
          }
        />
        <Route
          path="/programs"
          element={
            <Programs route={navLinks[2].path} label={navLinks[2].label} />
          }
        />
        <Route
          path="/teachers"
          element={
            <Teachers route={navLinks[3].path} label={navLinks[3].label} />
          }
        />
        <Route
          path="/sessions"
          element={
            <Sessions route={navLinks[4].path} label={navLinks[4].label} />
          }
        />
        <Route
          path="/students"
          element={
            <Students route={navLinks[5].path} label={navLinks[5].label} />
          }
        />
        <Route
          path="/mapping"
          element={
            <Mapping route={navLinks[6].path} label={navLinks[6].label} />
          }
        />
        <Route
          path="/payments"
          element={
            <Payments route={navLinks[7].path} label={navLinks[7].label} />
          }
        />
        <Route
          path="/announcements"
          element={
            <Announcements route={navLinks[8].path} label={navLinks[8].label} />
          }
        />
        <Route
          path="/enrollments"
          element={
            <Enrollments route={navLinks[9].path} label={navLinks[9].label} />
          }
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </NavBar>
  );
};

export default MadrasaHome;