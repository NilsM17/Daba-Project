'use client';
import React, { useState } from 'react';
import { 
  Table, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableBody, 
  Box,
  TableContainer,
  Paper,
  Chip,
  Typography,
  TablePagination,
  alpha
} from '@mui/material';
import FeedIcon from '@mui/icons-material/Feed';
import HouseIcon from '@mui/icons-material/House';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface Tiere {
    id: string;
    Name: string;
    Pfleger: string;
    ArtenID: string;
}

interface Pfleger {
    FirstName: string;
    LastName: string;
}

interface Tierart {
    id: string;
    Art: string;
    Revier: string;
    Geb_ude: string;
}

interface Futter {
    TierArt: string;
    Futter: string;
    Uhrzeit: string;
}

interface TiereTableProps {
    tiere: Tiere[];
    pfleger: Pfleger[];
    tierart: Tierart[];
    futter: Futter[];
}

// Generate a color based on string input (for consistent colors per species)
const getColorByString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str?.length || 0; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Create color variants
  const colors = [
    ['#e3f2fd', '#1976d2'], // blue
    ['#e8f5e9', '#2e7d32'], // green
    ['#fff8e1', '#ffa000'], // amber
    ['#f3e5f5', '#7b1fa2'], // purple
    ['#e1f5fe', '#0288d1'], // light blue
    ['#e0f2f1', '#00796b'], // teal
    ['#f9fbe7', '#9e9d24'], // lime
    ['#fbe9e7', '#d84315'], // deep orange
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const TiereTable: React.FC<TiereTableProps> = ({ tiere, pfleger, tierart, futter }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PetsIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                    Art
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FeedIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                    Revier
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <HouseIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                    Gebäude
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                    Pfleger
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <RestaurantIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                    Fütterung
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tiere
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((t) => {
                                const pflegerer = pfleger.find((p) => t.Pfleger === p.LastName);
                                const tierarten = tierart.find((a) => t.ArtenID === a.id);
                                const futterung = futter.find((f) => tierarten?.Art === f.TierArt);
                                const [bgColor, textColor] = tierarten ? getColorByString(tierarten.Art) : ['#f5f5f5', '#616161'];

                                return (
                                    <TableRow 
                                        key={t.id}
                                        hover
                                        sx={{ 
                                            '&:hover': { 
                                                backgroundColor: alpha('#3a7bd5', 0.04),
                                                cursor: 'pointer' 
                                            },
                                            transition: 'background-color 0.2s'
                                        }}
                                        onClick={() => window.location.href = `/admindashboard/Tiere/${t.id}`}
                                    >
                                        <TableCell>
                                            <Chip 
                                                label={tierarten ? tierarten.Art : 'Unbekannt'} 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: bgColor, 
                                                    color: textColor,
                                                    fontWeight: 500,
                                                    px: 0.5
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight={500}>{t.Name}</Typography>
                                        </TableCell>
                                        <TableCell>{tierarten ? tierarten.Revier : 'Unbekannt'}</TableCell>
                                        <TableCell>{tierarten ? tierarten.Geb_ude : 'Unbekannt'}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {pflegerer ? (
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {`${pflegerer.FirstName} ${pflegerer.LastName}`}
                                                    </Typography>
                                                ) : (
                                                    <Typography color="text.secondary">Nicht zugewiesen</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {futterung ? (
                                                <Chip 
                                                    icon={<RestaurantIcon fontSize="small" />} 
                                                    label={futterung.Uhrzeit}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            ) : (
                                                <Typography color="text.secondary" variant="body2">-</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tiere.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Zeilen pro Seite:"
                />
            </TableContainer>
        </Box>
    );
};

export default TiereTable;