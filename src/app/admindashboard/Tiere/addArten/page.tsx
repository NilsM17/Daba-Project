'use client';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Breadcrumbs, 
  Link, 
  IconButton, 
  alpha, 
  Tooltip,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress
} from '@mui/material';
import React, { useState } from 'react';
import { addData } from './addData';
import { Layout } from '@/components/Layout';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';

function AddArten() {
    const router = useRouter();
    const [tierArt, setArt] = useState("");
    const [gebaeude, setGebaeude] = useState("");
    const [revier, setRevier] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async () => {
        if (!tierArt || !gebaeude || !revier) return;
        
        setIsSubmitting(true);
        try {
            await addData(tierArt, gebaeude, revier);
            // Reset form after successful submission
            setArt("");
            setGebaeude("");
            setRevier("");
            // You could add a success notification here
        } catch (error) {
            console.error("Error adding species:", error);
            // You could add an error notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Neue Tierart hinzufügen">
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumb Navigation */}
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
                        <Link
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            href="/admindashboard/Tiere"
                        >
                            <PetsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Tiere
                        </Link>
                        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Neue Tierart
                        </Typography>
                    </Breadcrumbs>
                </Box>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Neue Tierart hinzufügen
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Hier können Sie eine neue Tierart mit zugehörigem Gebäude und Revier anlegen
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/admindashboard/Tiere')}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Zurück zur Übersicht
                    </Button>
                </Box>
                
                {/* Main Content */}
                <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 0 }}>
                        {/* Form Input Section */}
                        <Box sx={{ p: 4, backgroundColor: 'white' }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                Details der neuen Tierart
                            </Typography>
                            
                            <Grid container spacing={3}>
                                {/* Tierart Field */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <CategoryIcon sx={{ fontSize: '1rem', mr: 0.5, opacity: 0.7 }} /> 
                                        Tierart
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id='tierArt'
                                        placeholder='z.B. Löwe, Tiger, Elefant'
                                        variant='outlined'
                                        value={tierArt}
                                        onChange={(e) => setArt(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                {/* Gebaeude Field */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <HomeIcon sx={{ fontSize: '1rem', mr: 0.5, opacity: 0.7 }} /> 
                                        Gebäude
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id='Gebaeude'
                                        placeholder='z.B. Raubtierhaus, Tropenhaus'
                                        variant='outlined'
                                        value={gebaeude}
                                        onChange={(e) => setGebaeude(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                {/* Revier Field */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <FeedIcon sx={{ fontSize: '1rem', mr: 0.5, opacity: 0.7 }} /> 
                                        Revier
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id='Revier'
                                        placeholder='z.B. Nordflügel, Außenanlage Ost'
                                        variant='outlined' 
                                        value={revier}
                                        onChange={(e) => setRevier(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            
                            {/* Action Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                    onClick={handleSubmit}
                                    disabled={!tierArt || !gebaeude || !revier || isSubmitting}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {isSubmitting ? 'Wird hinzugefügt...' : 'Tierart hinzufügen'}
                                </Button>
                            </Box>
                        </Box>
                        
                        <Divider />
                        
                        {/* Tips Section */}
                        <Box sx={{ p: 3, backgroundColor: alpha('#e3f2fd', 0.5) }}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                                Hinweise:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Die Tierart wird für die Kategorisierung der Tiere verwendet<br />
                                • Das Gebäude beschreibt, wo sich das Tier im Zoo befindet<br />
                                • Das Revier hilft den Pflegern bei der Orientierung
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Layout>
    );
}

export default AddArten;