
import Dashboard from "./dashboard";
import MasjidDetails from "./masjid_details";
import SalahTimings from "./salah_timings";
import Announcements from "./announcements";
import NavBar from  "../nav/navbar";
import { Routes, Route } from "react-router-dom";
import NotFound from "../404/not_found";

const Home = () => {
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
 
export default Home;