import { prisma } from '@/db'; // Import Prisma client
import { Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Chip, Card, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PlaceIcon from '@mui/icons-material/Place';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Data type definitions - adjust if your Prisma schema is different
interface Tier {
  id: string;
  Name: string;
  ArtenID: string;
}

interface Tierart {
  id: string;
  Art: string;
  Revier: string;
  Geb_ude: string;
}

interface Futter {
  id?: number;
  TierArt: string;
  Uhrzeit: string;
}

export default async function Home() {
  // Fetch data from Prisma
  const tiere = await prisma.tiere.findMany();
  const tierart = await prisma.tierArten.findMany();
  const futter = await prisma.futter.findMany({
    select: {
      TierArt: true,
      Uhrzeit: true
    }
  });
  
  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: '#f5f7fa', 
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: '#1a3353',
          textAlign: 'center'
        }}
      >
        <PetsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Naturzoo Rheine
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <Card sx={{ 
          p: 2, 
          flex: '1',
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          bgcolor: '#e3f2fd'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Gesamtzahl Tiere</Typography>
          <Typography variant="h3">{tiere.length}</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          flex: '1',
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          bgcolor: '#e8f5e9'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Tierarten</Typography>
          <Typography variant="h3">{tierart.length}</Typography>
        </Card>
        
        <Card sx={{ 
          p: 2, 
          flex: '1',
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          bgcolor: '#fff8e1'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Fütterungszeiten</Typography>
          <Typography variant="h3">{futter.length}</Typography>
        </Card>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          href="/Login"
          sx={{
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '10px 24px',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            }
          }}
        >
          Login
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PetsIcon sx={{ mr: 1 }} /> Art
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlaceIcon sx={{ mr: 1 }} /> Revier
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1 }} /> Gebäude
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RestaurantIcon sx={{ mr: 1 }} /> Fütterung
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiere.map((t) => {
              const tierarten = tierart.find((a: Tierart) => t.ArtenID === a.id);
              const futterTier = futter.find((f) => f.TierArt === tierarten?.Art);

              const ZeitbisFutter = futterTier
                ? (() => {
                  const [hours, minutes] = futterTier.Uhrzeit.split(":").map(Number);
                  const now = new Date();
                  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
                  const targetTotalMinutes = hours * 60 + minutes;

                  let diffMinutes = targetTotalMinutes - currentTotalMinutes;
                  if (diffMinutes < 0) {
                    diffMinutes += 24 * 60;
                  }

                  const diffHours = Math.floor(diffMinutes / 60);
                  const remainingMinutes = diffMinutes % 60;

                  return { hours: diffHours, minutes: remainingMinutes };
                })()
                : null;

              // Determine feeding status color
              let feedingStatusColor = 'success';
              if (ZeitbisFutter) {
                if (ZeitbisFutter.hours === 0 && ZeitbisFutter.minutes < 30) {
                  feedingStatusColor = 'error'; // Soon to feed (less than 30 mins)
                } else if (ZeitbisFutter.hours < 1) {
                  feedingStatusColor = 'warning'; // Feed within the hour
                }
              }

              return (
                <TableRow 
                  key={t.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
                    '&:hover': { bgcolor: 'rgba(25,118,210,0.04)' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={tierarten?.Art || "Unbekannt"} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'white',
                        fontWeight: 'medium'
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{t.Name}</TableCell>
                  <TableCell>{tierarten?.Revier || "Unbekannt"}</TableCell>
                  <TableCell>{tierarten?.Geb_ude || "Unbekannt"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {futterTier ? (
                        <>
                          <Chip 
                            icon={<AccessTimeIcon />} 
                            label={futterTier.Uhrzeit} 
                            size="small" 
                            color={feedingStatusColor as "success" | "warning" | "error"}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            in {ZeitbisFutter?.hours} Std. {ZeitbisFutter?.minutes} Min.
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Keine Fütterungszeit
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}