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
import VolunteerCategories from "./volunteer_categories";
import Job from "./job";
import JobCategories from "./job_categories";
import Daawah from "./daawah";
import DaawahCategories from "./daawah_categories";
import Activity from "./activity";
import ActivityCategories from "./activity_categories";
import Event from "./events";
import EventCategories from "./event_categories";
import Networking from "./networking";
import NetworkingCategories from "./networking_categories";
import UmrahHajj from "./umrah_and_hajj";
import Faq from "./faq";
import Learning from "./islamic_learning";


import {
  Dashboard as DashboardIcon,
  Mosque,
  Person,
  VolunteerActivism as VolunteerIcon,
  Category as CategoryIcon,
  Work as JobIcon,
  Forum as DaawahIcon,
  Task as ActivityIcon,
  Event as EventIcon,
  NetworkWifi as NetworkingIcon,
  FlightTakeoff as UmrahHajjIcon,
  QuestionAnswer as FaqIcon,
  Book as LearningIcon,
} from "@mui/icons-material";

const navLinks = [
  { path: "/admin/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/admin/masjids", label: "Masjids", icon: <Mosque /> },
  { path: "/admin/accounts", label: "User Accounts", icon: <Person /> },
  { path: "/admin/madrasas", label: "Madrasas", icon: <Mosque /> },
  { path: "/admin/volunteer", label: "Volunteer", icon: <VolunteerIcon /> },
  { path: "/admin/volunteer/categories", label: "Volunteer Categories", icon: <CategoryIcon /> },
  { path: "/admin/job", label: "Job", icon: <JobIcon /> },
  { path: "/admin/job/categories", label: "Job Categories", icon: <CategoryIcon /> },
  { path: "/admin/daawah", label: "Daawah", icon: <DaawahIcon /> },
  { path: "/admin/daawah/categories", label: "Daawah Categories", icon: <CategoryIcon /> },
  { path: "/admin/activity", label: "Activity", icon: <ActivityIcon /> },
  { path: "/admin/activity/categories", label: "Activity Categories", icon: <CategoryIcon /> },
  { path: "/admin/event", label: "Event", icon: <EventIcon /> },
  { path: "/admin/event/categories", label: "Event Categories", icon: <CategoryIcon /> },
  { path: "/admin/networking", label: "Networking", icon: <NetworkingIcon /> },
  { path: "/admin/networking/categories", label: "Networking Categories", icon: <CategoryIcon /> },
  { path: "/admin/umrah-hajj", label: "Umrah and Hajj", icon: <UmrahHajjIcon /> },
  { path: "/admin/faq", label: "Faq's", icon: <FaqIcon /> },
  { path: "/admin/learning", label: "Islamic Learning", icon: <LearningIcon /> },
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
    <NavBar navLinks={navLinks}>
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
          path="/volunteer/categories"
          element={
            <VolunteerCategories
              route={navLinks[5].path}
              label={navLinks[5].label}
            />
          }
        />
        <Route
          path="/job"
          element={<Job route={navLinks[6].path} label={navLinks[6].label} />}
        />
        <Route
          path="/job/categories"
          element={
            <JobCategories route={navLinks[7].path} label={navLinks[7].label} />
          }
        />
        <Route
          path="/daawah"
          element={<Daawah route={navLinks[8].path} label={navLinks[8].label} />}
        />
        <Route
          path="/daawah/categories"
          element={
            <DaawahCategories
              route={navLinks[9].path}
              label={navLinks[9].label}
            />
          }
        />
        <Route
          path="/activity"
          element={
            <Activity route={navLinks[10].path} label={navLinks[10].label} />
          }
        />
        <Route
          path="/activity/categories"
          element={
            <ActivityCategories
              route={navLinks[11].path}
              label={navLinks[11].label}
            />
          }
        />
        <Route
          path="/event"
          element={<Event route={navLinks[12].path} label={navLinks[12].label} />}
        />
        <Route
          path="/event/categories"
          element={
            <EventCategories
              route={navLinks[13].path}
              label={navLinks[13].label}
            />
          }
        />
        <Route
          path="/networking"
          element={
            <Networking route={navLinks[14].path} label={navLinks[14].label} />
          }
        />
        <Route
          path="/networking/categories"
          element={
            <NetworkingCategories
              route={navLinks[15].path}
              label={navLinks[15].label}
            />
          }
        />
        <Route
          path="/umrah-hajj"
          element={
            <UmrahHajj route={navLinks[16].path} label={navLinks[16].label} />
          }
        />
        <Route
          path="/faq"
          element={<Faq route={navLinks[17].path} label={navLinks[17].label} />}
        />
        <Route
          path="/learning"
          element={
            <Learning route={navLinks[18].path} label={navLinks[18].label} />
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </NavBar>
  );
};

export default AdminHome;