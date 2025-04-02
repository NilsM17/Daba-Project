'use client';

import { 
  Box,
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Select,
  FormControl,
  InputLabel,
  Container,
  Card,
  CardContent,
  Grid,
  Divider,
  FormHelperText,
  Breadcrumbs,
  Link,
  alpha,
  CircularProgress,
  Paper
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { addData, getTierArten } from './addData';
import { TimePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { Layout } from '@/components/Layout';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

function AddFutterung() {
    const router = useRouter();
    const [tierArt, setTierArt] = useState<string>("");
    const [futter, setFutter] = useState<string>("");
    const [uhrzeit, setUhrzeit] = useState<string>("");
    const [tierArtOptions, setTierArtOptions] = useState<{ id: string; Art: string; Geb_ude: string; Revier: string; }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Format date to HH:mm
    const formatTime = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Handle time change
    const handleTimeChange = (time: Date | null) => {
        setUhrzeit(formatTime(time)); // Store formatted time as HH:mm
    };

    useEffect(() => {
        setLoading(true);
        getTierArten()
            .then(data => setTierArtOptions(data))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async () => {
        if (!tierArt || !futter || !uhrzeit) return;
        
        setIsSubmitting(true);
        try {
            await addData(tierArt, futter, uhrzeit);
            setSuccessMessage(`Fütterungsplan für ${tierArt} erfolgreich hinzugefügt.`);
            setTierArt("");
            setFutter("");
            setUhrzeit("");
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error adding feeding schedule:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Fütterungszeit hinzufügen">
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
                            <RestaurantIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Fütterungszeit
                        </Typography>
                    </Breadcrumbs>
                </Box>

                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Neue Fütterungszeit hinzufügen
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Erstellen Sie einen neuen Fütterungsplan für eine bestimmte Tierart
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

                {/* Success Message */}
                {successMessage && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            backgroundColor: alpha('#4caf50', 0.1),
                            border: '1px solid',
                            borderColor: alpha('#4caf50', 0.2),
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box sx={{ 
                                backgroundColor: '#4caf50', 
                                borderRadius: '50%', 
                                width: 32, 
                                height: 32, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mr: 2
                            }}>
                                <PetsIcon sx={{ color: 'white', fontSize: 18 }} />
                            </Box>
                            <Typography color="#1b5e20" fontWeight={500}>
                                {successMessage}
                            </Typography>
                        </Box>
                    </Paper>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Card elevation={0} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                {/* Tierart Selection */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <PetsIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                        Tierart
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            value={tierArt}
                                            onChange={(e) => setTierArt(e.target.value as string)}
                                            displayEmpty
                                            variant='outlined'
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiSelect-select': {
                                                    padding: '13px 14px'
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                <Typography color="text.secondary">Tierart auswählen</Typography>
                                            </MenuItem>
                                            {tierArtOptions.map((option) => (
                                                <MenuItem key={option.id} value={option.Art}>{option.Art}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Wählen Sie die Tierart, für die Sie einen Fütterungsplan erstellen möchten</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Futter Input */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <RestaurantIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                        Futter
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id="futter"
                                        placeholder='z.B. Fleisch, Früchte, Gemüse'
                                        variant="outlined"
                                        value={futter}
                                        onChange={(e) => setFutter(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                    <FormHelperText>Geben Sie die Art des Futters an</FormHelperText>
                                </Grid>

                                {/* Time Picker */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                        Uhrzeit
                                    </Typography>
                                    <Box sx={{ 
                                        '& .rs-picker-toggle': {
                                            borderRadius: '8px',
                                            height: '54px',
                                            padding: '0 14px',
                                            borderColor: '#ddd',
                                        },
                                        '& .rs-picker': {
                                            width: '100%'
                                        }
                                    }}>
                                        <TimePicker
                                            format="HH:mm"
                                            onChange={handleTimeChange}
                                            placeholder="Fütterungszeit wählen"
                                            cleanable={false}
                                        />
                                    </Box>
                                    <FormHelperText>Wählen Sie die Uhrzeit für die Fütterung</FormHelperText>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            {/* Form Actions */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => router.push('/admindashboard/Tiere')}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                    onClick={handleSubmit}
                                    disabled={!tierArt || !futter || !uhrzeit || isSubmitting}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {isSubmitting ? 'Wird hinzugefügt...' : 'Fütterungszeit hinzufügen'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Information Box */}
                <Box sx={{ mt: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: alpha('#e3f2fd', 0.5),
                            border: '1px solid',
                            borderColor: alpha('#2196f3', 0.1)
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                            Hinweise zur Fütterungszeit:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Fütterungszeiten werden für alle Tiere der ausgewählten Art festgelegt<br />
                            • Die Pfleger erhalten automatisch eine Benachrichtigung zu den angegebenen Zeiten<br />
                            • Berücksichtigen Sie die natürlichen Fresszeiten der jeweiligen Tierart
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
}

export default AddFutterung;