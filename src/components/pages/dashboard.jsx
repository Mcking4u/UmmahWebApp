import React from "react";
import { useDispatch } from "react-redux";
import { updateNavState } from "../../redux/navSlice";
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

const RootCard = styled(Card)({
  maxWidth: 345,
  minWidth: 300,
  borderRadius: 20,
});

const Dashboard = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateNavState({ headerText: "Dashboard", activeLink: "/" }));
  }, []);

  return (
    <div>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", marginBottom: "20px" }}
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
        <RootCard>
          <CardMedia
            sx={{height: 180,}}
            image={Masjid}
            title="Image title"
          />
          <CardContent>
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
              Masjid
            </Typography>
          </CardContent>
        </RootCard>

        <RootCard>
          <CardMedia
            sx={{height: 180,}}
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
            sx={{height: 180,}}
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
            sx={{height: 180,}}
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
    </div>
  );
};

export default () => (
  <SlideTransition>
    <Dashboard />
  </SlideTransition>
);
