
import Dashboard from "./dashboard";
import MasjidDetails from "./masjid_details";
import SalahTimings from "./salah_timings";
import Announcements from "./announcements";
import NavBar from  "../nav/navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "../404/not_found";
import React from "react";
import NetworkHandler from "../../network/network_handler";

const MasjidHome = () => {

  const navigate = useNavigate();
  React.useEffect(() => {
    let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    if(appToken === "" || appToken === undefined || appToken === null){
      navigate("/login");
    }
  }, [])

    return ( 
        <NavBar>
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