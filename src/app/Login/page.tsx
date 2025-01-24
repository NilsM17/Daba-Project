'use client';

import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { login, checkRights } from './login'; // Server-side function
import { setToken } from '../admindashboard/checkToken'; // Client-side token setter

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const userRights = await checkRights(username, password);

    if (await userRights === 'admin') {
      try {
        const token = await login(username, password); // Call server-side function
        if (token) {
          setToken(token); // Set token in memory
          localStorage.setItem('bearerToken', token); // Persist token in localStorage
          window.location.href = '/admindashboard'; // Redirect to dashboard
        } else {
          setError('Invalid username or password');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    if (await userRights === 'pfleger') {
      try {
        const token = await login(username, password); // Call server-side function
        if (token) {
          setToken(token); // Set token in memory
          localStorage.setItem('bearerToken', token); // Persist token in localStorage
          window.location.href = '/pflegerdashboard'; // Redirect to dashboard
        } else {
          setError('Invalid username or password');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f0f0f0"
      p={4}
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h4" mb={3}>
        Login
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        disabled={!username || !password || loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
    </Box>
  );
}

export default LoginPage;
