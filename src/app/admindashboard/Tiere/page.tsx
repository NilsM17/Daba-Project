'use server';
import { getTiere, getPfleger, getTierart, getFutter } from './getTiere';
import TiereTable from './TierTable';
import { PflegerToken } from '../Pfleger/PflegerToken';
import {
  Box,
  Paper,
  Typography,
  Container,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Breadcrumbs,
  Link,
  alpha,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Layout } from '@/components/Layout';

async function Tiere() {
  const tiere = await getTiere(); // Server-side function
  const pfleger = await getPfleger(); // Server-side function
  const tierart = await getTierart(); // Server-side function
  const futter = await getFutter(); // Server-side function

  return (
    <Layout title="Tiere">


      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              href="/admindashboard"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
              <PetsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Tierverwaltung
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Header Section with Improved Layout */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(to right, #3a7bd5, #00d2ff)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            color: 'white'
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '1.8rem', sm: '2.2rem' }
                }}
              >
                <PetsIcon sx={{ mr: 1, fontSize: { xs: 32, sm: 40 } }} />
                Tierverwaltung
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mt: 0.5, opacity: 0.9, fontWeight: 300, fontSize: '1.1rem' }}
              >
                Umfassende Verwaltung und Übersicht aller Tiere im System
              </Typography>
            </Box>
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#3a7bd5',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  mr: 1
                }}
                href='/admindashboard/Tiere/add'
              >
                Neues Tier
              </Button><Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#3a7bd5',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  mr: 1
                }}
                href='/admindashboard/Tiere/addFutter'
              >
                Neue Futterzeit
              </Button><Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#3a7bd5',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  mr: 1
                }}
                href='/admindashboard/Tiere/addArten'
              >
                Neue Tierart
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards with Enhanced Visual Appeal */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Animals Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 2px 15px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {tiere.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      Tiere gesamt
                    </Typography>
                  </Box>
                  <Box sx={{
                    bgcolor: alpha('#3a7bd5', 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PetsIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Species Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 2px 15px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {tierart.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      Tierarten
                    </Typography>
                  </Box>
                  <Box sx={{
                    bgcolor: alpha('#3a7bd5', 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CategoryIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Caretakers Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 2px 15px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {pfleger.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      Pfleger
                    </Typography>
                  </Box>
                  <Box sx={{
                    bgcolor: alpha('#3a7bd5', 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PersonIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Feed Types Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 2px 15px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                      {futter.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      Futterarten
                    </Typography>
                  </Box>
                  <Box sx={{
                    bgcolor: alpha('#3a7bd5', 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <RestaurantIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Table Content with Enhanced Styling and Action Buttons */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <Box sx={{
            p: 2,
            bgcolor: '#f8f9fa',
            borderBottom: '1px solid #eaedf0',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Tierübersicht
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detaillierte Informationen zu allen registrierten Tieren
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: alpha('#3a7bd5', 0.04),
                    borderColor: 'primary.main',
                  }
                }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: alpha('#3a7bd5', 0.04),
                    borderColor: 'primary.main',
                  }
                }}
              >
                Aktualisieren
              </Button>
            </Box>
          </Box>

          <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <TiereTable
              tiere={tiere}
              pfleger={pfleger}
              tierart={tierart}
              futter={futter}
            />
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}

export default Tiere;