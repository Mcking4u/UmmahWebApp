
import Dashboard from "./dashboard";
import MasjidDetails from "./masjid_details";
import SalahTimings from "./salah_timings";
import Announcements from "./announcements";
import NavBar from  "../nav/navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "../404/not_found";
import React from "react";
import NetworkHandler from "../../network/network_handler";


import { Dashboard as DashboardIcon, Mosque, Timeline, AnnouncementOutlined } from "@mui/icons-material";

const navLinks = [
  { path: "/masjid/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/masjid/details", label: "Masjid Details", icon: <Mosque /> },
  { path: "/masjid/salah-timings", label: "Salah Timings", icon: <Timeline /> },
  { path: "/masjid/announcements", label: "Announcements", icon: <AnnouncementOutlined /> }
];


const MasjidHome = () => {

  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if(appToken === "" || appToken === undefined || appToken === null){
      navigate("/login");
    }
  }, [])

    return ( 
        <NavBar navLinks={navLinks}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/details" element={<MasjidDetails />} />
            <Route path="/salah-timings" element={<SalahTimings />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/*" element={<NotFound />} />

          </Routes>
        </NavBar>
     );
}
 
export default MasjidHome;