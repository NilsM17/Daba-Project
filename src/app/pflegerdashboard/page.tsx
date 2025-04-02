'use client';
import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { getTime } from './getTime';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

function PflegerDash() {
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [pflegername, setPflegerName] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch all Arbeitszeiten (work times) for the logged-in user
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("bearerToken");
      if (!token) {
        throw new Error("Sie sind nicht angemeldet. Bitte melden Sie sich an.");
      }
      
      // Get user name from token if possible
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.name) {
          setPflegerName(tokenData.name);
        }
      } catch (e) {
        console.log("Could not parse token for name");
      }
      
      const Arbeitszeiten = await getTime(token);
      
      if (Arbeitszeiten && Array.isArray(Arbeitszeiten)) {
        // Calculate total hours
        let hours = 0;
        
        // Convert the fetched data into a format compatible with DayPilot
        const data: DayPilot.EventData[] = Arbeitszeiten.map((arbeitszeit, index) => {
          const start = new Date(arbeitszeit.StartTime);
          const end = new Date(arbeitszeit.EndTime);
          
          // Calculate hours for this shift
          const shiftHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          hours += shiftHours;
          
          return {
            id: index + 1,
            text: `Schicht (${Math.round(shiftHours * 10) / 10}h)`,
            start: start.toISOString(),
            end: end.toISOString(),
            backColor: "#3a7bd5", // Calendar event color
            fontColor: "#ffffff",
            borderColor: "#2a5db0",
            tags: { 
              type: "work",
              hours: shiftHours
            }
          };
        });
        
        setEvents(data);
        setTotalHours(Math.round(hours * 10) / 10);
      } else {
        throw new Error("Keine Arbeitszeiten gefunden");
      }
    } catch (err: any) {
      setError(err.message || "Beim Laden des Zeitplans ist ein Fehler aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date.toISOString().slice(0, 10));
  };

  const goToNextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date.toISOString().slice(0, 10));
  };

  const goToToday = () => {
    setCurrentDate(new Date().toISOString().slice(0, 10));
  };

  // Get current month name
  const getMonthName = () => {
    const date = new Date(currentDate);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" fontWeight={700} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1
            }}>
              <TodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              Pfleger Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {pflegername ? `Willkommen zurück, ${pflegername}` : 'Ihr persönlicher Zeitplan'}
            </Typography>
          </Grid>
          
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchSchedule}
              disabled={isLoading}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Aktualisieren
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3, 
            height: '100%',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Arbeitsstunden</Typography>
                <Box sx={{ 
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AccessTimeIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {totalHours}h
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="Diesen Monat" 
                  size="small" 
                  sx={{ borderRadius: 1 }} 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3, 
            height: '100%',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Schichten</Typography>
                <Box sx={{ 
                  backgroundColor: '#2ecc71',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <EventIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#2ecc71' }}>
                {events.length}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="Geplant" 
                  size="small" 
                  sx={{ borderRadius: 1, backgroundColor: '#e8f5e9', color: '#2e7d32' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3, 
            height: '100%',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Status</Typography>
                <Box sx={{ 
                  backgroundColor: '#9b59b6',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AccountCircleIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#9b59b6' }}>
                Aktiv
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="Angemeldet" 
                  size="small" 
                  sx={{ borderRadius: 1, backgroundColor: '#f3e5f5', color: '#7b1fa2' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Section */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
          }}>
            {/* Calendar Header */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f8f9fa', 
              borderBottom: '1px solid #eaedf0',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <IconButton onClick={goToPreviousMonth}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={600} sx={{ mx: 2, minWidth: 180, textAlign: 'center' }}>
                  {getMonthName()}
                </Typography>
                <IconButton onClick={goToNextMonth}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
              
              <Button 
                variant="outlined" 
                onClick={goToToday}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Heute
              </Button>
            </Box>
            
            {/* Calendar Content */}
            <Box sx={{ p: 0 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ p: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : (
                <Box sx={{ 
                  '.calendar-container': { 
                    width: '100%', 
                    // Customize calendar styling
                    '.month_default_cell_inner': {
                      padding: '10px',
                      fontSize: '13px',
                    },
                    '.month_default_event_inner': {
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 500
                    },
                    '.month_default_cell_header': {
                      padding: '8px 2px',
                      backgroundColor: '#f5f5f5'
                    }
                  }
                }}>
                  <div className="calendar-container">
                    <DayPilotMonth
                        startDate={currentDate}
                        events={events}
                        theme="light"
                      eventMoveHandling="Disabled"
                      eventResizeHandling="Disabled"
                      timeRangeSelectedHandling="Disabled"
                    />
                  </div>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Legend Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 15px rgba(0,0,0,0.06)',
              mt: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Legende
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      backgroundColor: '#3a7bd5', 
                      borderRadius: 1, 
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2">Arbeitseinsatz</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PflegerDash;