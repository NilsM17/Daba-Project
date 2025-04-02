'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { checkLocalStorage, checkToken } from './checkToken';
import { checkDatabaseConnection } from './checkDB';
import { PflegerToken } from './Pfleger/PflegerToken';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Layout } from '@/components/Layout';

function AdminDashboard() {
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setIsLoading(true);
        const isConnected = await checkDatabaseConnection();
        setDbStatus(isConnected ? 'Connected' : 'Disconnected');
      } catch (error) {
        console.error('Error checking database:', error);
        setDbStatus('Error');
      } finally {
        setIsLoading(false);
      }
    };

    const getUserInfo = async () => {
      const token = await checkLocalStorage();
      if (token) {
        // Here you would typically decode the token to get user info
        // For now just using a placeholder
        setUserName('Administrator');
      }
    };

    checkDatabase();
    getUserInfo();
  }, []);

  const NavButton = ({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) => (
    <Button
      variant="contained"
      color="primary"
      href={href}
      startIcon={icon}
      sx={{
        py: 1.5,
        px: 3,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        }
      }}
    >
      {text}
    </Button>
  );

  return (
    <Layout title="Admin Dashboard">
      <Box
        sx={{
          p: 3,
          bgcolor: '#f5f7fa',
          minHeight: '100vh'
        }}
      >
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={600} color="primary">
              <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Willkommen zurück, {userName || 'Benutzer'}
            </Typography>
          </Box>
          <PflegerToken />
        </Paper>

        {/* Status Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Database Status</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography>Checking connection...</Typography>
                  </Box>
                ) : (
                  <Chip
                    icon={dbStatus === 'Connected' ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={dbStatus === 'Connected' ? 'Connected' : 'Connection Error'}
                    color={dbStatus === 'Connected' ? 'success' : 'error'}
                    variant="filled"
                    sx={{ fontWeight: 500, px: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Mitarbeiter</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h3" fontWeight={500} color="primary">
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aktive Pfleger
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PetsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Tierpflege</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h3" fontWeight={500} color="primary">
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tiere unter Betreuung
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">System Status</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="System Online"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: 500, px: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Schnellzugriff
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <NavButton
                href="admindashboard/Pfleger"
                icon={<PeopleIcon />}
                text="Pfleger Verwaltung"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NavButton
                href="admindashboard/Ort"
                icon={<LocationOnIcon />}
                text="Standorte"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NavButton
                href="admindashboard/Tiere"
                icon={<PetsIcon />}
                text="Tiere Verwaltung"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NavButton
                href="admindashboard/Tiere/AddFutterung"
                icon={<RestaurantIcon />}
                text="Fütterungsplan"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* System Information */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={500}>
            System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Version:</strong> 1.0.0
              </Typography>
              <Typography variant="body1">
                <strong>Last Update:</strong> {new Date().toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Server Time:</strong> {new Date().toLocaleTimeString()}
              </Typography>
              <Typography variant="body1">
                <strong>Environment:</strong> Production
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}

export default AdminDashboard;