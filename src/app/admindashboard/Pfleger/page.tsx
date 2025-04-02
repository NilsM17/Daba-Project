'use client';

import { Box, Button, TableCell, TableRow, Card, Typography, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { EnhancedTable } from '@/components/EnhancedTable';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

interface Pfleger {
  id: string;
  created_at: Date;
  LastName: string;
  FirstName: string;
  PLZ: string;
  Phonenumber: string;
}

interface Ort {
  id: string;
  Name: string;
  PLZ: string;
}

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
  marginBottom: theme.spacing(3),
}));

function PflegerPage() {
  const [pfleger, setPfleger] = useState<Pfleger[]>([]);
  const [orte, setOrte] = useState<Ort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your data here using API routes
        const pflegerRes = await fetch('/api/pfleger');
        const orteRes = await fetch('/api/orte');
        
        const pflegerData = await pflegerRes.json();
        const orteData = await orteRes.json();
        
        setPfleger(pflegerData);
        setOrte(orteData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout title="Pfleger Management">
      {/* Rest of your component */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Pfleger Übersicht
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <StatCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Gesamtzahl Pfleger
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="medium">
              {pfleger.length}
            </Typography>
          </StatCard>
          
          <StatCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aktive Standorte
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="medium">
              {new Set(pfleger.map(p => p.PLZ)).size}
            </Typography>
          </StatCard>
        </Box>
      </Box>
      
      <EnhancedTable 
        title="Pfleger Liste" 
        headers={["Nachname", "Vorname", "Ort", "Telefonnummer", "Status"]}
        actionButtons={
          <Box>
            <StyledButton
              variant="contained"
              color="primary"
              href="Pfleger/add"
              startIcon={<AddIcon />}
            >
              Neuer Pfleger
            </StyledButton>
            <StyledButton
              variant="outlined"
              color="secondary"
              href="Pfleger/editworktime"
              startIcon={<AccessTimeIcon />}
            >
              Arbeitszeit bearbeiten
            </StyledButton>
          </Box>
        }
      >
        {pfleger.map((p) => {
          const ort = orte.find((o) => o.PLZ === p.PLZ);
          return (
            <TableRow 
              key={p.id} 
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(33, 150, 243, 0.04)',
                  cursor: 'pointer' 
                },
                transition: 'background-color 0.2s'
              }}
            >
              <TableCell>{p.LastName}</TableCell>
              <TableCell>{p.FirstName}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ort ? ort.Name : "Unbekannt"}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {p.PLZ}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{p.Phonenumber}</TableCell>
              <TableCell>
                <Chip 
                  icon={<PersonIcon />} 
                  label="Aktiv" 
                  color="success" 
                  size="small" 
                  sx={{ borderRadius: 1 }} 
                />
              </TableCell>
            </TableRow>
          );
        })}
      </EnhancedTable>
    </Layout>
  );
}

export default PflegerPage;