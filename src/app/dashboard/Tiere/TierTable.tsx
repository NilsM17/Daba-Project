'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import { checkToken, checkLocalStorage } from '../checkToken';

interface Tiere {
    id: string;
    Name: string;
    Pfleger: string;
}

interface Pfleger {
    FirstName: string;
    LastName: string;
}

interface Tierart {
    Art: string;
    TierName: string;
    Revier: string;
    Geb_ude: string;
}

interface TiereTableProps {
    tiere: Tiere[];
    pfleger: Pfleger[];
    tierart: Tierart[];
}

const TiereTable: React.FC<TiereTableProps> = ({ tiere, pfleger, tierart }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Art</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Revier</TableCell>
                    <TableCell>Gebäude</TableCell>
                    <TableCell>Pfleger Vorname</TableCell>
                    <TableCell>Pfleger Nachname</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tiere.map((t) => {
                    const pflegerer = pfleger.find((p) => t.Pfleger === p.LastName);
                    const tierarten = tierart.find((a) => t.Name === a.TierName);

                    return (
                        <TableRow key={t.id}>
                            <TableCell>{tierarten ? tierarten.Art : 'Unknown'}</TableCell>
                            <TableCell>{t.Name}</TableCell>
                            <TableCell>{tierarten ? tierarten.Revier : 'Unknown'}</TableCell>
                            <TableCell>{tierarten ? tierarten.Geb_ude : 'Unknown'}</TableCell>
                            <TableCell>{pflegerer ? pflegerer.FirstName : 'Unknown'}</TableCell>
                            <TableCell>{pflegerer ? pflegerer.LastName : 'Unknown'}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default TiereTable;
