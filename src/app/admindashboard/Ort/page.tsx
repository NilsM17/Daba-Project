import { prisma } from '@/db';
import { 
  Box, 
  Table, 
  TableContainer, 
  TableHead, 
  TableCell, 
  TableBody,
  TableRow, 
  Button, 
  Paper, 
  Typography, 
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import React from 'react';
import axios from 'axios';
import { PflegerToken } from '../Pfleger/PflegerToken';
import { Layout } from '@/components/Layout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

async function Ort() {
  interface Ort {
    id: number;
    Name: string;
    PLZ: string;
  }
  
  const orte = await prisma.orte.findMany();
  const pfleger = await prisma.pfleger.findMany();

  // Location validation logic from your original code
  orte.forEach(async (o) => {
    let found = false;
    pfleger.forEach(async (p) => {
      if (p.PLZ == o.PLZ) {
        found = true;
      }
    });
    if (!found) {
      await prisma.orte.delete({
        where: {
          id: o.id
        }
      });
    }
  });

  // Add missing locations logic from your original code
  pfleger.forEach(async (p) => {
    let found = false;
    orte.forEach(async (o) => {
      if (p.PLZ == o.PLZ) {
        found = true;
      }
    });
    if (!found) {
      const OrtName = await axios.get(`https://openplzapi.org/de/Localities?postalCode=${p.PLZ}`).then((response) => { return response.data[0].name });
      console.log(OrtName);
      await prisma.orte.create({
        data: {
          Name: OrtName,
          PLZ: p.PLZ,
          created_at: new Date().toISOString()
        }
      });
    }
  });

  // Calculate stats for dashboard cards
  const ortsByLetter: Record<string, number> = {};
  orte.forEach(ort => {
    const firstLetter = ort.Name.charAt(0).toUpperCase();
    if (!ortsByLetter[firstLetter]) {
      ortsByLetter[firstLetter] = 0;
    }
    ortsByLetter[firstLetter]++;
  });

  // Count caretakers per location
  const pflegerByLocation: Record<string, number> = {};
  pfleger.forEach(p => {
    if (!pflegerByLocation[p.PLZ]) {
      pflegerByLocation[p.PLZ] = 0;
    }
    pflegerByLocation[p.PLZ]++;
  });

  return (
    <Layout title="Standorte">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4" fontWeight="700" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#2c3e50'
              }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                Standortverwaltung
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                Verwaltung und Übersicht aller registrierten Standorte
              </Typography>
            </Grid>
            <Grid item>
              <PflegerToken />
            </Grid>
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary">Gesamt Standorte</Typography>
                  <Box sx={{ 
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PlaceIcon sx={{ color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="700" color="primary.main">
                  {orte.length}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={`${Object.keys(ortsByLetter).length} verschiedene Anfangsbuchstaben`} 
                    size="small" 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary">PLZ-Bereiche</Typography>
                  <Box sx={{ 
                    backgroundColor: '#2ecc71',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MailOutlineIcon sx={{ color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="700" sx={{ color: '#2ecc71' }}>
                  {Array.from(new Set(orte.map(o => o.PLZ.substring(0, 1)))).length}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={`Postleitzahl Regionen`} 
                    size="small" 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary">Pfleger zugewiesen</Typography>
                  <Box sx={{ 
                    backgroundColor: '#9b59b6',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PeopleAltIcon sx={{ color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="700" sx={{ color: '#9b59b6' }}>
                  {pfleger.length}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={`${Object.keys(pflegerByLocation).length} Standorte mit Pflegern`} 
                    size="small" 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">Standortübersicht</Typography>
          <Box>
            <Tooltip title="Neue Standorte suchen">
              <Button 
                sx={{ 
                  textTransform: "none", 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  mr: 2
                }} 
                variant="contained" 
                color="primary" 
                href='Ort'
                startIcon={<AddIcon />}
              >
                Fehlende Standorte hinzufügen
              </Button>
            </Tooltip>
            <Tooltip title="Suchen">
              <IconButton color="primary" sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Aktualisieren">
              <IconButton 
                color="primary" 
                sx={{ ml: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Location Table */}
        <TableContainer component={Paper} elevation={0} sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
          mb: 4
        }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>PLZ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ort</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Pfleger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orte.length > 0 ? (
                orte.map((ort) => {
                  // Count caretakers for this location
                  const pflegerCount = pfleger.filter(p => p.PLZ === ort.PLZ).length;
                  
                  return (
                    <TableRow 
                      key={ort.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Chip 
                          label={ort.PLZ} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#e3f2fd', 
                            color: '#1976d2',
                            fontWeight: 500
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography>{ort.Name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {pflegerCount > 0 ? (
                          <Chip 
                            icon={<PeopleAltIcon />} 
                            label={`${pflegerCount} Pfleger`} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        ) : (
                          <Chip 
                            label="Keine Pfleger" 
                            size="small" 
                            color="default"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Alert severity="info" sx={{ my: 2 }}>
                      Keine Standorte gefunden. Fügen Sie fehlende Standorte hinzu.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
}

export default Ort;