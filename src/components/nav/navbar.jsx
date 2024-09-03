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
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NetworkHandler from "../../network/network_handler";
import {
  AnnouncementOutlined,
  Dashboard,
  LogoutOutlined,
  Mosque,
  Timeline,
} from "@mui/icons-material";

const drawerWidth = 240;

function NavBar(props) {
  const { window, navLinks, useDividers } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
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
        {navLinks.map((link, index) => (
          <React.Fragment key={link.path}>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeLink === link.path}
                sx={{
                  "&:hover": {
                    borderRadius: "12px",
                  },
                  "&.Mui-selected": {
                    borderRadius: "12px",
                  },
                  mb: 1,
                }}
                onClick={() => navigateTo(link.path)}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
            {useDividers && index === 3 ? (
              <div>
                <Divider />
                <Typography
                  component="div"
                  variant="subtitle1"
                  sx={{ mt: 2, pl: 2, mb: 1 }}
                >
                  Services
                </Typography>
              </div>
            ) : (
              <div></div>
            )}

            {useDividers && index === 0 || index === 10 ? (
              <div>
                <Divider sx={{ mb: 1 }} />
              </div>
            ) : (
              <div></div>
            )}

          </React.Fragment>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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

            <Box>
              {userData && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    onClick={handleAvatarClick}
                    sx={{ cursor: "pointer", width: 40, height: 40 }}
                    src={userData.avatarUrl || "https://example.com/avatar.jpg"}
                  />
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">
                        {userData.username || "Admin"}
                      </Typography>
                      <Typography variant="subtitle1">
                        {userData.name || "Admin"}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<LogoutOutlined />}
                        onClick={() => {
                          localStorage.setItem(
                            NetworkHandler.loginTokenKey,
                            ""
                          );
                          localStorage.setItem(
                            NetworkHandler.loginResponseKey,
                            ""
                          );
                          navigateTo("/");
                        }}
                        sx={{ mt: 2 }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </Popover>
                </Box>
              )}
            </Box>
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
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

export default NavBar;
