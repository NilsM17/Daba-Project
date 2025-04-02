'use client';
import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { getTime, updateTime, addTime, getuserbadge, deleteTime } from './getTime';
import { Layout } from '@/components/Layout';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Chip, 
  Divider, 
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Grid,
  ButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Define types for user data
interface User {
  LastName: string;
  badge: string | null;
  FirstName?: string;
}

// Define types for the events
interface TimeEvent {
  id: string;
  StartTime: string | Date;
  EndTime: string | Date;
  badge: string;
}

// Generate random colors for users
const generateUserColor = (name: string): string => {
  // Create a simple hash from the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert to a hue and create HSL color with good saturation and lightness
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 65%)`;
};

function PflegerDash() {
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);
  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfMonth());
  const [calendar, setCalendar] = useState<DayPilot.Month | null>(null);
  const [usersWithBadges, setUsersWithBadges] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userColors, setUserColors] = useState<Record<string, string>>({});
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // User filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const toggleUserFilter = (userName: string) => {
    setSelectedUsers(prev => 
      prev.includes(userName)
        ? prev.filter(name => name !== userName)
        : [...prev, userName]
    );
  };

  // Month navigation functions
  const goToPreviousMonth = () => {
    if (calendar) {
      const startDateAsDayPilot = new DayPilot.Date(calendar.startDate);
      const newDate = startDateAsDayPilot.addMonths(-1);
      calendar.startDate = newDate;
      calendar.update();
      setStartDate(newDate);
    }
  };
  // Fix the extra closing brace after goToNextMonth
const goToNextMonth = () => {
  if (calendar && calendar.startDate) {
    const startDateAsDayPilot = new DayPilot.Date(calendar.startDate);
    const newDate = startDateAsDayPilot.addMonths(1);
    calendar.startDate = newDate;
    calendar.update();
    setStartDate(newDate);
  }
}; // Remove the extra curly brace here

  const goToToday = () => {
    const today = DayPilot.Date.today();
    if (calendar) {
      calendar.startDate = today.firstDayOfMonth();
      calendar.update();
    }
    setStartDate(today.firstDayOfMonth());
  };

  // Fetch all users with badges
  useEffect(() => {
    const fetchUsersWithBadges = async () => {
      setLoading(true);
      setError('');
      try {
        const users = await getuserbadge();
        setUsersWithBadges(users);
        
        // Generate colors for each user
        const colorMap: Record<string, string> = {};
        users.forEach((user: User) => {
          colorMap[user.LastName] = generateUserColor(user.LastName);
        });
        setUserColors(colorMap);
        
      } catch (error) {
        console.error('Error fetching users with badges:', error);
        setError('Failed to load user data. Please try again later.');
      }
    };

    fetchUsersWithBadges();
  }, []);

  // Fetch time events
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const allArbeitszeiten = await getTime();
        if (allArbeitszeiten && allArbeitszeiten.length > 0) {
          const filteredData = allArbeitszeiten.map((event: TimeEvent) => {
            const user = usersWithBadges.find(user => user.badge === event.badge);
            const userName = user ? user.LastName : "Unknown";
            
            return {
              id: event.id,
              text: `${userName}`,
              start: new Date(event.StartTime).toISOString(),
              end: new Date(event.EndTime).toISOString(),
              tags: {
                badgeID: event.badge,
                userName: userName,
              },
              backColor: userColors[userName] || '#7986cb',
              fontColor: '#fff',
              borderColor: 'transparent',
            };
          });
          setEvents(filteredData);
        }
      } catch (error) {
        console.error('Error fetching work times:', error);
        setError('Failed to load schedule data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (usersWithBadges.length > 0) {
      fetchTime();
    }
  }, [usersWithBadges, userColors]);

  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: "Name", id: "text", type: "text" },
      { name: "Start Time", id: "start", type: "datetime" },
      { name: "End Time", id: "end", type: "datetime" },
      {
        name: "Pfleger",
        id: "tags.userName",
        type: "select",
        options: usersWithBadges.map((user: User) => ({ 
          id: user.LastName, 
          text: `${user.FirstName || ''} ${user.LastName}`, 
          value: user.LastName 
        })),
      },
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    const updatedEvent = modal.result;
    updatedEvent.start = new Date(updatedEvent.start);
    updatedEvent.end = new Date(updatedEvent.end);

    // Find the badge based on the selected username
    const selectedUser = usersWithBadges.find(user => user.LastName === updatedEvent.tags.userName);

    if (!selectedUser || !selectedUser.badge) {
      alert("The selected user does not have a valid badge. Please assign a badge to the user first.");
      return;
    }

    updatedEvent.tags.badgeID = selectedUser.badge;
    updatedEvent.backColor = userColors[updatedEvent.tags.userName] || '#7986cb';

    try {
      await updateTime(
        e.data.id, 
        updatedEvent.start, 
        updatedEvent.end, 
        updatedEvent.tags.badgeID
      );
      calendar?.events.update(updatedEvent);
      setEvents(prevEvents => prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Error updating work time:', error);
      alert("Failed to update the work time. Please try again.");
    }
  };

  const addNewEvent = async (start: Date, end: Date) => {
    const form = [
      { name: "Name", id: "text", type: "text", value: "Arbeitszeit" },
      { name: "Start Time", id: "start", type: "datetime" },
      { name: "End Time", id: "end", type: "datetime" },
      {
        name: "Pfleger",
        id: "tags.userName",
        type: "select",
        options: usersWithBadges.map((user: User) => ({ 
          id: user.LastName, 
          text: `${user.FirstName || ''} ${user.LastName}`, 
          value: user.LastName 
        })),
      },
    ];

    const modal = await DayPilot.Modal.form(form, {
      start: start,
      end: end,
      text: "Arbeitszeit",
      tags: { badgeID: "", userName: "" },
    });

    if (modal.canceled) {
      return;
    }

    const newEvent = modal.result;
    newEvent.start = new Date(newEvent.start);
    newEvent.end = new Date(newEvent.end);

    const selectedUser = usersWithBadges.find(user => user.LastName === newEvent.tags.userName);

    if (!selectedUser || !selectedUser.badge) {
      alert("The selected user does not have a valid badge. Please assign a badge to the user first.");
      return;
    }

    newEvent.tags.badgeID = selectedUser.badge;
    newEvent.backColor = userColors[newEvent.tags.userName] || '#7986cb';
    newEvent.fontColor = '#fff';
    newEvent.borderColor = 'transparent';

    try {
      const createdEvent = await addTime(
        newEvent.start, 
        newEvent.end, 
        newEvent.tags.badgeID
      );
      newEvent.id = createdEvent.id;
      calendar?.events.add(newEvent);
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Error creating work time:', error);
      alert("Failed to create new work time. Please try again.");
    }
  };

  const deleteEvent = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this work time?");
    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTime(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      calendar?.events.remove(id);
    } catch (error) {
      console.error('Error deleting work time:', error);
      alert("Failed to delete work time. Please try again.");
    }
  };

  // Filter events based on selected users
  const filteredEvents = selectedUsers.length > 0
    ? events.filter(event => selectedUsers.includes(event.tags.userName))
    : events;

  const refreshCalendar = async () => {
    setLoading(true);
    try {
      const allArbeitszeiten = await getTime();
      if (allArbeitszeiten && allArbeitszeiten.length > 0) {
        const filteredData = allArbeitszeiten.map((event: TimeEvent) => {
          const user = usersWithBadges.find(user => user.badge === event.badge);
          const userName = user ? user.LastName : "Unknown";
          
          return {
            id: event.id,
            text: `${userName}`,
            start: new Date(event.StartTime).toISOString(),
            end: new Date(event.EndTime).toISOString(),
            tags: {
              badgeID: event.badge,
              userName: userName,
            },
            backColor: userColors[userName] || '#7986cb',
            fontColor: '#fff',
            borderColor: 'transparent',
          };
        });
        setEvents(filteredData);
      }
    } catch (error) {
      console.error('Error refreshing calendar data:', error);
      setError('Failed to refresh schedule data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && usersWithBadges.length === 0) {
    return (
      <Layout title="Arbeitszeit-Planung">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Daten werden geladen...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Arbeitszeit-Planung">
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} /> Arbeitszeit-Planung
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Verwalten Sie den Arbeitsplan für alle Pfleger
            </Typography>
          </Box>
          
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => addNewEvent(new Date(), new Date(new Date().getTime() + 3600000))}
              sx={{ mr: 1, borderRadius: 2 }}
            >
              Neue Arbeitszeit
            </Button>
            
            <IconButton 
              color="primary" 
              onClick={handleFilterClick}
              sx={{ mr: 1 }}
            >
              <FilterListIcon />
            </IconButton>
            
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              {usersWithBadges.map((user: User) => (
                <MenuItem 
                  key={`filter-${user.LastName}-${user.badge}`}
                  onClick={() => toggleUserFilter(user.LastName)}
                  sx={{ 
                    backgroundColor: selectedUsers.includes(user.LastName) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
                  }}
                >
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    backgroundColor: userColors[user.LastName] || '#ccc',
                    mr: 1
                  }} />
                  {`${user.FirstName || ''} ${user.LastName}`}
                </MenuItem>
              ))}
              {selectedUsers.length > 0 && (
                <MenuItem onClick={() => setSelectedUsers([])}>
                  <Typography color="primary">Alle anzeigen</Typography>
                </MenuItem>
              )}
            </Menu>
            
            <Tooltip title="Aktualisieren">
              <IconButton color="primary" onClick={refreshCalendar}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {selectedUsers.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Filter:</Typography>
            {selectedUsers.map(name => (
              <Chip 
                key={`chip-${name}`}
                label={name}
                size="small"
                onDelete={() => toggleUserFilter(name)}
                sx={{ 
                  mr: 0.5, 
                  mb: 0.5, 
                  backgroundColor: userColors[name] || '#ccc',
                  color: '#fff'
                }}
              />
            ))}
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <CalendarMonthIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Aktueller Monat
                </Typography>
                <Typography variant="h6">
                  {startDate ? startDate.toDate().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) : ''}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <PersonIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Pfleger mit Arbeitszeit
                </Typography>
                <Typography variant="h6">
                  {new Set(events.map(e => e.tags.userName)).size}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <DateRangeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Arbeitszeiteinträge
                </Typography>
                <Typography variant="h6">
                  {events.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', height: '100%' }}>
                <ButtonGroup variant="outlined" sx={{ width: '100%', height: '100%' }}>
                  <Button 
                    sx={{ borderRadius: '2px 0 0 2px', width: '33%' }} 
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button 
                    sx={{ borderRadius: 0, width: '34%' }} 
                    onClick={goToToday}
                  >
                    <TodayIcon sx={{ mr: 0.5 }} />
                    Heute
                  </Button>
                  <Button 
                    sx={{ borderRadius: '0 2px 2px 0', width: '33%' }} 
                    onClick={goToNextMonth}
                  >
                    <ChevronRightIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            '.calendar_default_main': { borderRadius: '8px' },
            '.calendar_default_event': { borderRadius: '4px' },
            '.calendar_default_cell_header': { fontWeight: 'bold' },
            '.calendar_default_corner': { backgroundColor: '#f5f5f5' },
            '.calendar_default_title, .calendar_default_main, .calendar_default_cell_header': { backgroundColor: '#f9f9f9' }
          }}>
            <DayPilotMonth
              startDate={startDate}
              events={filteredEvents}
              onEventClick={async (args: { e: DayPilot.Event }) => {
                await editEvent(args.e);
              }}
              onTimeRangeSelected={async (args: { start: DayPilot.Date, end: DayPilot.Date }) => {
                await addNewEvent(args.start.toDate(), args.end.toDate());
              }}
              eventDeleteHandling="Update"
              onEventDeleted={async (args: { e: DayPilot.Event }) => {
                await deleteEvent(args.e.data.id);
              }}
              contextMenu={new DayPilot.Menu({
                items: [
                  { text: "Bearbeiten", onClick: async (args: { source: DayPilot.Event }) => { await editEvent(args.source); } },
                  { text: "Löschen", onClick: async (args: { source: DayPilot.Event }) => { await deleteEvent(String(args.source.id())); }, icon: "icon-delete" },
                ],
              })}
              controlRef={(control: DayPilot.Month) => {
                setCalendar(control);
                if (control && control.visibleStart) {
                  setStartDate(control.visibleStart);
                }
              }}
              headerHeight={35}
              cellHeight={80}
              theme="calendar_default"
              onBeforeCellRender={(args: { cell: { start: DayPilot.Date } }) => {
                // This will run when the visible range changes
                if (args.cell.start.dayOfWeek() === 1 && args.cell.start.getDay() <= 7) {
                  // First Monday of the month
                  setStartDate(args.cell.start);
                }
              }}
            />
          </Box>
        )}
      </Paper>
      
      {/* User Legend */}
      <Paper elevation={0} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Legende:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {usersWithBadges.map((user: User, index: number) => (
            <Chip 
              key={`legend-${user.LastName}-${index}`}
              label={`${user.FirstName || ''} ${user.LastName}`}
              size="small"
              sx={{ 
                backgroundColor: userColors[user.LastName] || '#ccc',
                color: 'white'
              }}
            />
          ))}
        </Box>
      </Paper>
    </Layout>
  );
}

export default PflegerDash;