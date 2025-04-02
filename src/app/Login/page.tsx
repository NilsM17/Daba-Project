'use client';

import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Paper, 
  Container, 
  InputAdornment,
  IconButton,
  Avatar,
  Alert,
  Slide
} from '@mui/material';
import React, { useState } from 'react';
import { login, checkRights } from './login'; // Server-side function
import { setToken } from '../admindashboard/checkToken'; // Client-side token setter
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PetsIcon from '@mui/icons-material/Pets';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userRights = await checkRights(username, password);

      if (userRights === 'admin' || userRights === 'pfleger') {
        const token = await login(username, password);
        if (token) {
          setToken(token);
          localStorage.setItem('bearerToken', token);
          
          // Redirect based on user rights
          window.location.href = userRights === 'admin' 
            ? '/admindashboard' 
            : '/pflegerdashboard';
        } else {
          setError('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihren Benutzernamen und Ihr Passwort.');
        }
      } else {
        setError('Zugriff verweigert. Sie haben keine Berechtigung, sich anzumelden.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        padding: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="sm">
        <Slide direction="up" in={true} timeout={400}>
          <Paper
            elevation={10}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                py: 4,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <PetsIcon sx={{ color: 'primary.main', fontSize: 30 }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                color="white"
                fontWeight="bold"
              >
                Tierpflege System
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="white" 
                sx={{ opacity: 0.85, mt: 1 }}
              >
                Melden Sie sich an, um fortzufahren
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 1 }}
                  variant="filled"
                >
                  {error}
                </Alert>
              )}
              
              <TextField
                id="username"
                label="Benutzername"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <TextField
                id="password"
                label="Passwort"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleLogin}
                disabled={!username || !password || loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Anmelden'
                )}
              </Button>
              
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Bei Problemen mit der Anmeldung wenden Sie sich bitte an den Administrator.
              </Typography>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}

export default LoginPage;