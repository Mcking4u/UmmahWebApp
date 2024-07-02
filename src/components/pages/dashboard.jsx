import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';
import SlideTransition from '../animation/slide_transition';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Masjid from "../../assets/mosque.jpg";
import Maktab from "../../assets/maktab.png";
import Wedding from "../../assets/wedding.png";
import Funeral from "../../assets/funeral.png";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth: 300,
    borderRadius: 20, 
  },
  media: {
    height: 180,
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
});

const Dashboard = () => {

  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(updateNavState({headerText: "Dashboard", activeLink:"/"}))
  }, [] );

  const classes = useStyles();

  return (
    <div>
      <Typography variant="h6" className={classes.heading}>
       Services
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap:"20px", justifyContent: 'center' }}>
      <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={Masjid}
              title="Image title"
            />
            <CardContent>
            <Typography variant="subtitle1" sx={{textAlign:"center"}}>
                Masjid
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={Maktab}
              title="Image title"
            />
            <CardContent>
            <Typography variant="subtitle1" sx={{textAlign:"center"}}>
                Maktab
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={Wedding}
              title="Image title"
            />
            <CardContent>
            <Typography variant="subtitle1" sx={{textAlign:"center"}}>
                Wedding
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={Funeral}
              title="Image title"
            />
            <CardContent sx={{width:'100%'}}>
              <Typography variant="subtitle1" sx={{textAlign:"center"}}>
                Funeral
              </Typography>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default () => (
  <SlideTransition>
      <Dashboard />
  </SlideTransition>
);