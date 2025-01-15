import { prisma } from '@/db';
import { Table, TableHead, TableCell, TableRow } from '@mui/material';
import React from 'react'

async function Ort() {
    interface Ort {
        id: number;
        Name: string;
        PLZ: string;
      }
      const orte = await prisma.orte.findMany();
    return (
        <Table>
            <TableHead >
                <TableCell sx={{ color: "white" }}>PLZ</TableCell>
                <TableCell sx={{ color: "white" }}>Name</TableCell>

            </TableHead>
            {orte.map((o) => {
          
          return (
                <TableRow key={o.id}>
                    <TableCell>{o.PLZ}</TableCell>
                    <TableCell>{o.Name}</TableCell>

                </TableRow>
            );
            })}
        </Table>
    )
}

export default Ort