'use client';
import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Typography, 
  Paper, 
  Container,
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  CircularProgress
} from '@mui/material';
import { addData, getTierArten, getPfleger } from './addData';
import { Layout } from '@/components/Layout';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';

function AddTiere() {
    const router = useRouter();
    const [tierName, setTierName] = React.useState("");
    const [pfleger, setPfleger] = React.useState("");
    const [tierArt, setTierArt] = React.useState("");
    const [gebaeude, setGebaeude] = React.useState("");
    const [revier, setRevier] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [tierArtOptions, setTierArtOptions] = React.useState<{ id: string; Art: string; Geb_ude: string; Revier: string; }[]>([]);
    const [pflegerOptions, setPflegerOptions] = React.useState<{ id: string; firstName: string; lastName: string; }[]>([]);

    React.useEffect(() => {
        setLoading(true);
        Promise.all([
            getTierArten().then(data => setTierArtOptions(data)),
            getPfleger().then((data: { id: string; FirstName: string; LastName: string; PLZ: string; Phonenumber: string; badge: string | null; created_at: string; }[]) => {
                const formattedData = data.map(item => ({ id: item.id, firstName: item.FirstName, lastName: item.LastName }));
                setPflegerOptions(formattedData);
            })
        ]).finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        const selectedTier = tierArtOptions.find(option => option.Art === tierArt);
        if (selectedTier) {
            setGebaeude(selectedTier.Geb_ude);
            setRevier(selectedTier.Revier);
        }
    }, [tierArt, tierArtOptions]);

    const handleSubmit = async () => {
        if (!tierName || !pfleger || !tierArt) return;
        
        setIsSubmitting(true);
        try {
            await addData(tierName, pfleger, tierArt, gebaeude, revier);
            // Success notification could be added here
            router.push('/admindashboard/Tiere');
        } catch (error) {
            console.error("Error adding animal:", error);
            // Error notification could be added here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Neues Tier hinzufügen">
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
                            Neues Tier
                        </Typography>
                    </Breadcrumbs>
                </Box>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Neues Tier hinzufügen
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Hier können Sie ein neues Tier in die Datenbank einpflegen
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Card elevation={0} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                {/* Tier Name */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <PetsIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                            Name des Tieres
                                        </Typography>
                                        <TextField 
                                            fullWidth
                                            id='tierName'
                                            placeholder='z.B. Leo, Simba, Max'
                                            variant='outlined'
                                            value={tierName}
                                            onChange={(e) => setTierName(e.target.value)}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Pfleger */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                            Zuständiger Pfleger
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                value={pfleger}
                                                onChange={(e) => setPfleger(e.target.value as string)}
                                                displayEmpty
                                                variant='outlined'
                                                sx={{ 
                                                    borderRadius: 2,
                                                    '& .MuiSelect-select': {
                                                        padding: '13px 14px'
                                                    }
                                                }}
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <Typography color="text.secondary">Pfleger auswählen</Typography>;
                                                    }
                                                    return selected;
                                                }}
                                            >
                                                <MenuItem value="" disabled>
                                                    <Typography color="text.secondary">Pfleger auswählen</Typography>
                                                </MenuItem>
                                                {pflegerOptions.map((option) => (
                                                    <MenuItem key={option.id} value={option.lastName}>
                                                        {`${option.firstName} ${option.lastName}`}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>Verantwortlicher Pfleger für das Tier</FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Grid>

                                {/* Tierart */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <CategoryIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
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
                                            <FormHelperText>Die Tierart bestimmt Gebäude und Revier</FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Grid>

                                {/* Gebaeude */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <HomeIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                            Gebäude
                                        </Typography>
                                        <TextField 
                                            fullWidth
                                            id='gebaeude'
                                            variant='outlined'
                                            value={gebaeude}
                                            disabled
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: alpha('#f5f5f5', 0.7)
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Revier */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <FeedIcon sx={{ mr: 1, fontSize: '1rem', opacity: 0.7 }} />
                                            Revier
                                        </Typography>
                                        <TextField 
                                            fullWidth
                                            id='revier'
                                            variant='outlined'
                                            value={revier}
                                            disabled
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: alpha('#f5f5f5', 0.7)
                                                }
                                            }}
                                        />
                                    </Box>
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
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    onClick={handleSubmit}
                                    disabled={!tierName || !pfleger || !tierArt || isSubmitting}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {isSubmitting ? 'Wird gespeichert...' : 'Tier hinzufügen'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Layout>
    );
}

export default AddTiere;