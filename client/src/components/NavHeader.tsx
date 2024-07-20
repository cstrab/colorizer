import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Stack, Toolbar, Typography } from '@mui/material';

import { IHeaderProps } from '../interfaces/headerInterface';

import sampleLogo from '../assets/paint-brush.png';
import '../styles/styles.css';

const VER = import.meta.env.VITE_APP_VERSION ? ` v. ${import.meta.env.VITE_APP_VERSION}` : ` v. DEV`;

export const NavHeader: React.FC<IHeaderProps> = ({ pageTitle }) => {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: '#303030',
          display: 'grid',
          gridTemplateColumns: '50px auto 1fr auto',
          gap: 'px',
          height: '60px',
          padding: '0 15px',
          alignItems: 'center',
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          displayPrint: 'none',
        }}
        component="nav"
      >
        <img src={sampleLogo} alt="Logo" className="small-logo" />
        <Typography component="h1" variant="h6" style={{ fontWeight: 'bold' }}>
          {pageTitle}
          {VER && <small style={{ fontWeight: 'normal', fontSize: '13px', marginRight: '40px' }}>{VER}</small>}
        </Typography>
        <Stack direction="row" spacing={2}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/colorize" className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}>
            Colorize
          </NavLink>
        </Stack>
      </AppBar>
      <Toolbar className="header-toolbar" />
    </>
  );
};
