import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import NetworkHandler from '../../../network/network_handler';
import { Mosque, SchoolSharp } from '@mui/icons-material';
import withNavUpdate from '../../wrappers/with_nav_update';

const Dashboard = () => {
  const [data, setData] = useState({
    teachers: 0,
    madrasas: [],
    students: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await new NetworkHandler().getDashboard();
      setData(response);
    };

    fetchData();
  }, []);

  const cardsData = [
    { icon: <Mosque sx={{color:"#019B8F", fontSize:100}} />, number: data.madrasas.length, text: 'Total Madrasas' },
    { icon: <PeopleIcon  sx={{color:"#019B8F", fontSize:100}} />, number: data.teachers, text: 'Total Teachers' },
    { icon: <SchoolSharp  sx={{color:"#019B8F", fontSize:100}}  />, number: data.students, text: 'Total Students' },
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
        {/* <Typography variant='h3' sx={{mb:2}} >Hi, Welcome back!</Typography> */}
      <Grid container spacing={2}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{minHeight:300, display:'flex', justifyContent:"center", alignItems:"center"}}>
              <CardContent sx={{textAlign:"center"}}>
                <Box>{card.icon}</Box>
                <Box>
                  <Typography variant="h3">{card.number}</Typography>
                  <Typography variant="subtitle1">{card.text}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};


export default withNavUpdate(Dashboard);
