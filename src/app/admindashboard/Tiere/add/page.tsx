'use client';
import { Table, TableHead, TableRow, TableCell, TextField, Button, Select, MenuItem } from '@mui/material';
import React from 'react';
import { addData, getTierArten } from './addData';

function addTiere() {
    const [tierName, setTierName] = React.useState("");
    const [pfleger, setPfleger] = React.useState("");
    const [tierArt, setTierArt] = React.useState("");
    const [gebaeude, setGebaeude] = React.useState("");
    const [revier, setRevier] = React.useState("");

    const [tierArtOptions, setTierArtOptions] = React.useState<{ id: string; Art: string; Geb_ude: string; Revier: string; }[]>([]);

    React.useEffect(() => {
        getTierArten().then(data => setTierArtOptions(data));
    }, []);

    React.useEffect(() => {
        const selectedTier = tierArtOptions.find(option => option.Art === tierArt);
        if (selectedTier) {
            setGebaeude(selectedTier.Geb_ude);
            setRevier(selectedTier.Revier);
        }
    }, [tierArt, tierArtOptions]);

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>TierName</TableCell>
                        <TableCell>PflegerLastName</TableCell>
                        <TableCell>Tierart</TableCell>
                        <TableCell>Gebäude</TableCell>
                        <TableCell>Revier</TableCell>
                        <TableCell>ADD</TableCell>
                    </TableRow>
                </TableHead>
                <TableRow>
                    <TableCell>
                        <TextField id='tierName' variant='outlined' onChange={(e) => setTierName(e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <TextField id='pfleger' variant='outlined' onChange={(e) => setPfleger(e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <Select
                            value={tierArt}
                            onChange={(e) => setTierArt(e.target.value)}
                            displayEmpty
                            variant='outlined'
                            fullWidth
                        >
                            <MenuItem value="" disabled>Wähle eine Tierart</MenuItem>
                            {tierArtOptions.map((option) => (
                                <MenuItem key={option.id} value={option.Art}>{option.Art}</MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell>
                        <TextField id='gebaeude' variant='outlined' value={gebaeude} disabled />
                    </TableCell>
                    <TableCell>
                        <TextField id='revier' variant='outlined' value={revier} disabled />
                    </TableCell>
                    <TableCell>
                        <Button
                            sx={{ background: "white", color: "light-blue" }}
                            onClick={() => addData(tierName, pfleger, tierArt, gebaeude, revier)}
                            disabled={!tierName || !pfleger || !tierArt || !gebaeude || !revier}
                        >
                            ADD
                        </Button>
                    </TableCell>
                </TableRow>
            </Table>
        </div>
    );
}

export default addTiere;
