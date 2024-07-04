import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container, Grid } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';



const NotFoundPage = () => {

  return (
    <Container sx={{ height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',}} maxWidth="md">
      <Grid container spacing={2}
      sx={{widht:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}
      >
        <Grid item xs={12}>
          <ErrorOutline sx={{ fontSize: 50, fill: "#019B8F" }} />
          <Typography variant="h4" component="h1" gutterBottom>
            404 - Not Found
          </Typography>
          <Typography variant="body1" gutterBottom>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{mt:2}}
          >
            Go to Home Page
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFoundPage;
