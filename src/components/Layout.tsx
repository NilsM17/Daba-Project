'use client';

import React, { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { PflegerToken } from '@/app/admindashboard/Pfleger/PflegerToken';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admindashboard' },
    { text: 'Pfleger', icon: <PeopleIcon />, path: '/admindashboard/Pfleger' },
    { text: 'Tiere', icon: <PetsIcon />, path: '/admindashboard/Tiere' },
    { text: 'Orte', icon: <LocationOnIcon />, path: '/admindashboard/Ort' },
    { text: 'Fütterung', icon: <RestaurantIcon />, path: '/admindashboard/Tiere/addFutter' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ ml: 2, bgcolor: 'secondary.main' }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Toolbar /> {/* Space for the AppBar */}
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                component="button"
                key={item.text} 
                onClick={() => handleNavigation(item.path)}
                sx={{ borderRadius: '0 20px 20px 0', mx: 1, mb: 1 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem 
              component="button"
              onClick={() => {
                localStorage.removeItem('bearerToken');
                handleNavigation('/Login');
              }}
              sx={{ borderRadius: '0 20px 20px 0', mx: 1, my: 1, color: 'error.main' }}
            >
              <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Space for the AppBar */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};