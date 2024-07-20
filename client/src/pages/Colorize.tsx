import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ColorizeForm } from '../components/ColorizeForm';

export const Colorize: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
      <Card variant="outlined" style={{ width: 700, margin: 'auto', marginTop: '0px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Colorize:
          </Typography>
          <Typography color="textSecondary" marginBottom={'20px'}>
            <br/>
            Disclaimer:
            <br/>
            - Only ZIP folders containing .png files are supported
            <br/>
            - The color extension will be added to each .png file name and output ZIP folder name
            <br/>
            - Multiple mappings are acceptable, target colors will replace initial colors
          </Typography>
          <Typography color="textSecondary" marginBottom={'20px'}>
            How to use:
            <br/>
            1. Select a file to upload. 
            <br/>
            2. Specify a color extension.
            <br/>
            3. Select color mapping(s).
            <br/>
          </Typography>
          <ColorizeForm />
        </CardContent>
      </Card>
    </div>
  );
};