import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Skeleton, alpha } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { Mosque, SchoolSharp } from "@mui/icons-material";
// --- Restored original imports ---
import NetworkHandler from "../../../network/network_handler";
import withNavUpdate from "../../wrappers/with_nav_update";

// --- MOCK NetworkHandler removed ---

// A modern stat card component
const StatCard = ({ icon, number, text, bgColor, color }) => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      padding: 3,
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      },
    }}
  >
    <Box
      sx={{
        mr: 2.5,
        padding: 2,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(icon, { sx: { color: color, fontSize: 40 } })}
    </Box>
    <Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
        {number}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {text}
      </Typography>
    </Box>
  </Card>
);

// A skeleton loader for the stat card
const StatCardSkeleton = () => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      padding: 3,
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <Box sx={{ mr: 2.5 }}>
      <Skeleton variant="circular" width={64} height={64} />
    </Box>
    <Box sx={{ width: "calc(100% - 90px)" }}>
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="text" width="90%" height={20} />
    </Box>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState({
    total_teachers: 0,
    total_madrasas: 0,
    total_students: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // --- Use the original NetworkHandler ---
        const response = await new NetworkHandler().getDashboard();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // You could set an error state here to show a message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardsData = [
    {
      icon: <Mosque />,
      number: data.total_madrasas,
      text: "Total Madrasas",
      color: "primary.main",
      bgColor: (theme) => alpha(theme.palette.primary.main, 0.1),
    },
    {
      icon: <PeopleIcon />,
      number: data.total_teachers,
      text: "Total Teachers",
      color: "success.main",
      bgColor: (theme) => alpha(theme.palette.success.main, 0.1),
    },
    {
      icon: <SchoolSharp />,
      number: data.total_students,
      text: "Total Students",
      color: "warning.main",
      bgColor: (theme) => alpha(theme.palette.warning.main, 0.1),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 1 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Hi, Welcome back!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's a summary of your institution's activity.
        </Typography>
      </Box>

      {/* Grid for Stat Cards */}
      <Grid container spacing={3}>
        {isLoading
          ? // --- SKELETON STATE ---
            [1, 2, 3].map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n}>
                <StatCardSkeleton />
              </Grid>
            ))
          : // --- DATA LOADED STATE ---
            cardsData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StatCard
                  icon={card.icon}
                  number={card.number}
                  text={card.text}
                  color={card.color}
                  bgColor={card.bgColor}
                />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

// --- Restored HOC wrapper ---
export default withNavUpdate(Dashboard);
