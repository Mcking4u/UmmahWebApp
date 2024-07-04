import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Logo from "/logo.svg";
import {
  AnnouncementOutlined,
  Dashboard,
  LogoutOutlined,
  Mosque,
  Timeline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import UserProfileCard from "../profile/user_profile_card";
import NetworkHandler from "../../network/network_handler";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const drawerWidth = 240;

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userData, setUserData] = useState(null);

  const headerText = useSelector((state) => state.nav.headerText);
  const activeLink = useSelector((state) => state.nav.activeLink);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const networkHandler = new NetworkHandler();
        const data = await networkHandler.getUser();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const navigate = useNavigate();

  const navigateTo = (to) => {
    handleDrawerClose();
    navigate(to);
  };

  const drawer = (
    <div style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <Toolbar>
        <Box
          onClick={() => navigateTo("/")}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            cursor: "pointer",
          }}
        >
          <img src={Logo} style={{ width: "60px", height: "auto" }} />
        </Box>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeLink === "/"}
            sx={{
              "&:hover": {
                borderRadius: "12px",
              },
              "&.Mui-selected": {
                borderRadius: "12px",
              },
              mb: 1,
            }}
            onClick={() => navigateTo("/")}
          >
            <ListItemIcon>
              <Dashboard style={{ fill: activeLink === "/" ? "#019B8F" : "" }} />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeLink === "/details"}
            sx={{
              "&:hover": {
                borderRadius: "12px",
              },
              "&.Mui-selected": {
                borderRadius: "12px",
              },
              mb: 1,
            }}
            onClick={() => navigateTo("/details")}
          >
            <ListItemIcon>
              <Mosque style={{ fill: activeLink === "/details" ? "#019B8F" : "" }} />
            </ListItemIcon>
            <ListItemText primary={"Masjid Details"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeLink === "/salah-timings"}
            sx={{
              "&:hover": {
                borderRadius: "12px",
              },
              "&.Mui-selected": {
                borderRadius: "12px",
              },
              mb: 1,
            }}
            onClick={() => navigateTo("/salah-timings")}
          >
            <ListItemIcon>
              <Timeline style={{ fill: activeLink === "/salah-timings" ? "#019B8F" : "" }} />
            </ListItemIcon>
            <ListItemText primary={"Salah Timings"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeLink === "/announcements"}
            sx={{
              "&:hover": {
                borderRadius: "12px",
              },
              "&.Mui-selected": {
                borderRadius: "12px",
              },
              mb: 1,
            }}
            onClick={() => navigateTo("/announcements")}
          >
            <ListItemIcon>
              <AnnouncementOutlined style={{ fill: activeLink === "/announcements" ? "#019B8F" : "" }} />
            </ListItemIcon>
            <ListItemText primary={"Announcements"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ mt: 1, mb: 1 }}>
        {userData && (
          <UserProfileCard
            imageSrc={userData.avatarUrl || "https://example.com/avatar.jpg"}
            email={userData.email || "admin@olari.com"}
            name={userData.name || "Admin"}
            onLogout={() => {
              localStorage.setItem(NetworkHandler.loginTokenKey, "");
              navigateTo("/login");
            }}
          />
        )}
      </Box>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ minWidth: "150px" }}
            >
              {headerText}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          onTransitionEnd={handleDrawerTransitionEnd}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

export default NavBar;
