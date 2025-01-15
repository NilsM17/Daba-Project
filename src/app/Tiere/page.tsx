import { prisma } from '@/db';
import { Table, TableCell, TableHead, TableRow } from '@mui/material'
import React from 'react'

async function Tiere() {
    interface Tiere {
        Art: string;
        Name: string;
        Revier: string;
        Gebaeude: string;
    }
    const tiere = await prisma.tiere.findMany();
    return (
        <Table>
            <TableHead >
                <TableCell sx={{ color: "white" }}>Art</TableCell>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Revier</TableCell>
                <TableCell sx={{ color: "white" }}>Gebaeude</TableCell>

            </TableHead>
            {tiere.map((t) => {
          
          return (
                <TableRow key={t.id}>
                    <TableCell>{t.Art}</TableCell>
                    <TableCell>{t.Name}</TableCell>
                    <TableCell>{t.Revier}</TableCell>
                    <TableCell>{t.Gebaeude}</TableCell>

                </TableRow>
            );
            })}
        </Table>
    )
}

export default Tiere