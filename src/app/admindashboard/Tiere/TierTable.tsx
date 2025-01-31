'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableCell, TableHead, TableRow, TableBody, Button, Box } from '@mui/material';
import { checkToken, checkLocalStorage } from '../checkToken';

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

const TiereTable: React.FC<TiereTableProps> = ({ tiere, pfleger, tierart, futter }) => {
    return (
        <Box>
            <Button variant="contained" color="primary" href="Tiere/add">
                ADD
            </Button>
            <Button variant='contained' color='primary' href='Tiere/addFutter'>

                Add Futter
            </Button>
            <Button variant='contained' color='primary' href='Tiere/addArten'>
                Add Arten
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Art</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Revier</TableCell>
                        <TableCell>Gebäude</TableCell>
                        <TableCell>Pfleger Vorname</TableCell>
                        <TableCell>Pfleger Nachname</TableCell>
                        <TableCell>Fütterung</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tiere.map((t) => {
                        const pflegerer = pfleger.find((p) => t.Pfleger === p.LastName);
                        const tierarten = tierart.find((a) => t.ArtenID === a.id);
                        const futterung = futter.find((f) => tierarten?.Art === f.TierArt);

                        return (
                            <TableRow key={t.id}>
                                <TableCell>{tierarten ? tierarten.Art : 'Unknown'}</TableCell>
                                <TableCell>{t.Name}</TableCell>
                                <TableCell>{tierarten ? tierarten.Revier : 'Unknown'}</TableCell>
                                <TableCell>{tierarten ? tierarten.Geb_ude : 'Unknown'}</TableCell>
                                <TableCell>{pflegerer ? pflegerer.FirstName : 'Unknown'}</TableCell>
                                <TableCell>{pflegerer ? pflegerer.LastName : 'Unknown'}</TableCell>
                                <TableCell>{futterung?.Uhrzeit}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
};

export default TiereTable;
