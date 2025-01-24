'use client';

import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { checkLocalStorage, checkToken, setToken } from './checkToken';
import { checkDatabaseConnection } from './checkDB';
import { PflegerToken } from './Pfleger/PflegerToken';
function AdminDashboard() {
  const [dbStatus, setDbStatus] = useState('Checking...');


  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const isConnected = await checkDatabaseConnection();
        setDbStatus(isConnected ? 'Connected' : 'Disconnected');
      } catch (error) {
        console.error('Error checking database:', error);
        setDbStatus('Error');
      }
    };

    checkDatabase();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
      
      <PflegerToken />
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
        <Button
          sx={{ textTransform: 'capitalize', marginRight: 1 }}
          variant="contained"
          color="primary"
          href="admindashboard/Pfleger"
        >
          Pfleger
        </Button>
        
        <Button
          sx={{ textTransform: 'capitalize', marginRight: 1 }}
          variant="contained"
          color="primary"
          href="admindashboard/Ort"
        >
          Orte
        </Button>
        <Button
          sx={{ textTransform: 'capitalize', marginRight: 1 }}
          variant="contained"
          color="primary"
          href="admindashboard/Tiere"
        >
          Tiere
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 2 }}>
        <Typography variant="h1">Admin Dashboard</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{ marginRight: 1, fontSize: 44 }}>Database Status:</Typography>
          <Typography sx={{ fontSize: 44, color: dbStatus === 'Connected' ? 'green' : 'red' }}>
            {dbStatus === 'Connected' ? 'OK' : 'Not OK'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
