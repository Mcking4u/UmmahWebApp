import React from "react";
import SlideTransition from "../animation/slide_transition";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Masjid from "../../assets/mosque.jpg";
import Maktab from "../../assets/maktab.png";
import Wedding from "../../assets/wedding.png";
import Funeral from "../../assets/funeral.png";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NetworkHandler from "../../network/network_handler";

const RootCard = styled(Card)({
  maxWidth: 345,
  minWidth: 300,
  borderRadius: 20,
});

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#333",
        minHeight: "100vh",
      }}
    >
      <Container sx={{ pt: 4 }}>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}
        >
          Services
        </Typography>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <RootCard
            sx={{
              cursor: "pointer",
            }}
            onClick={() => {
              let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
              if (
                appToken === "" ||
                appToken === undefined ||
                appToken === null
              ) {
                navigate("/login");
              } else {
                navigate("/masjid/");
              }
            }}
          >
            <CardMedia
              sx={{ height: 180 }}
              image={Masjid}
              title="Image title"
            />
            <CardContent>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Masjid
              </Typography>
            </CardContent>
          </RootCard>

          <RootCard
            sx={{
              cursor: "pointer",
            }}
            onClick={() => {
              let appToken = localStorage.getItem(NetworkHandler.loginTokenKey);
              if (
                appToken === "" ||
                appToken === undefined ||
                appToken === null
              ) {
                navigate("/login");
              } else {
                navigate("/madrasa/");
              }
            }}
          >
            <CardMedia
              sx={{ height: 180 }}
              image={Maktab}
              title="Image title"
            />
            <CardContent>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Maktab
              </Typography>
            </CardContent>
          </RootCard>

          <RootCard>
            <CardMedia
              sx={{ height: 180 }}
              image={Wedding}
              title="Image title"
            />
            <CardContent>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Wedding
              </Typography>
            </CardContent>
          </RootCard>

          <RootCard>
            <CardMedia
              sx={{ height: 180 }}
              image={Funeral}
              title="Image title"
            />
            <CardContent sx={{ width: "100%" }}>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Funeral
              </Typography>
            </CardContent>
          </RootCard>
        </div>
      </Container>
    </div>
  );
};

export default Home;
