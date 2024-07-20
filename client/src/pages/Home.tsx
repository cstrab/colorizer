import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import logo from '../assets/paint-brush.png';

export const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
      <Card variant="outlined" style={{ maxWidth: 400, margin: 'auto', marginTop: '0px' }}>
        <CardContent>
          <Typography variant="h5" component="h2" marginBottom={'20px'}>
            Welcome to Colorizer
          </Typography>
          <img src={logo} alt="logo" style={{ width: '30%', marginBottom: '20px'}} />
          <Typography color="textSecondary" marginBottom={'20px'}>
            This is an application for recoloring images.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};