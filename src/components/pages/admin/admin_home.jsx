import React from "react";
import Dashboard from "./dashboard";
import Masjids from "./masjids";
import NavBar from "../../nav/navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "../../404/not_found";
import NetworkHandler from "../../../network/network_handler";
import Madrasas from "./madrasas";
import Accounts from "./accounts";
import Volunteer from "./volunteer";
import Job from "./job";
import Daawah from "./daawah";
import Activity from "./activity";
import Event from "./events";
import Networking from "./networking";
import UmrahHajj from "./umrah_and_hajj";
import Faq from "./faq";
import Learning from "./islamic_learning";

import {
  Dashboard as DashboardIcon,
  Mosque,
  Person,
  VolunteerActivism as VolunteerIcon,
  Work as JobIcon,
  Forum as DaawahIcon,
  Task as ActivityIcon,
  Event as EventIcon,
  NetworkWifi as NetworkingIcon,
  FlightTakeoff as UmrahHajjIcon,
  QuestionAnswer as FaqIcon,
  Book as LearningIcon,
  ProductionQuantityLimits,
} from "@mui/icons-material";
import HalalProducts from "./halal_products";

const navLinks = [
  { path: "/admin/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/admin/masjids", label: "Masjids", icon: <Mosque /> },
  { path: "/admin/accounts", label: "User Accounts", icon: <Person /> },
  { path: "/admin/madrasas", label: "Madrasas", icon: <Mosque /> },
  { path: "/admin/volunteer", label: "Volunteer", icon: <VolunteerIcon /> },
  { path: "/admin/job", label: "Job", icon: <JobIcon /> },
  { path: "/admin/daawah", label: "Daawah", icon: <DaawahIcon /> },
  { path: "/admin/activity", label: "Activity", icon: <ActivityIcon /> },
  { path: "/admin/event", label: "Event", icon: <EventIcon /> },
  // Updated index for Halal Products
  { path: "/admin/halal-products", label: "Halal Products", icon: <ProductionQuantityLimits /> },
  // Updated index for Networking
  { path: "/admin/networking", label: "Networking", icon: <NetworkingIcon /> },
  { path: "/admin/umrah-hajj", label: "Umrah and Hajj", icon: <UmrahHajjIcon /> },
  { path: "/admin/learning", label: "Islamic Learning", icon: <LearningIcon /> },
  { path: "/admin/faq", label: "Faq's", icon: <FaqIcon /> },
];

const AdminHome = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if (appToken === "" || appToken === undefined || appToken === null) {
      navigate("/login");
    }
    let responseData = localStorage.getItem(NetworkHandler.loginResponseKey);
    responseData = JSON.parse(responseData);
    let is_super_user = responseData.is_super_user;
    if (!is_super_user) {
      navigate("/login");
    }
  }, []);

  return (
    <NavBar navLinks={navLinks} useDividers={true}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard route={navLinks[0].path} label={navLinks[0].label} />
          }
        />
        <Route
          path="/masjids"
          element={
            <Masjids route={navLinks[1].path} label={navLinks[1].label} />
          }
        />
        <Route
          path="/accounts"
          element={
            <Accounts route={navLinks[2].path} label={navLinks[2].label} />
          }
        />
        <Route
          path="/madrasas"
          element={
            <Madrasas route={navLinks[3].path} label={navLinks[3].label} />
          }
        />
        <Route
          path="/volunteer"
          element={
            <Volunteer route={navLinks[4].path} label={navLinks[4].label} />
          }
        />
        <Route
          path="/job"
          element={<Job route={navLinks[5].path} label={navLinks[5].label} />}
        />
        <Route
          path="/daawah"
          element={<Daawah route={navLinks[6].path} label={navLinks[6].label} />}
        />
        <Route
          path="/activity"
          element={
            <Activity route={navLinks[7].path} label={navLinks[7].label} />
          }
        />
        <Route
          path="/event"
          element={<Event route={navLinks[8].path} label={navLinks[8].label} />}
        />
        {/* Updated index for Halal Products */}
        <Route
          path="/halal-products"
          element={
            <HalalProducts route={navLinks[9].path} label={navLinks[9].label} />
          }
        />
        {/* Updated index for Networking */}
        <Route
          path="/networking"
          element={
            <Networking route={navLinks[10].path} label={navLinks[10].label} />
          }
        />
        <Route
          path="/umrah-hajj"
          element={
            <UmrahHajj route={navLinks[11].path} label={navLinks[11].label} />
          }
        />
        <Route
          path="/learning"
          element={<Learning route={navLinks[12].path} label={navLinks[12].label} />}
        />
        <Route
          path="/faq"
          element={
            <Faq route={navLinks[13].path} label={navLinks[13].label} />
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </NavBar>
  );
};

export default AdminHome;