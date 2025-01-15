import { prisma } from '@/db';
import { Table, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react'

async function Pfleger() {
    interface Pfleger {
        id: number;
        created_at: Date;
        LastName: string;
        FirstName: string;
        PLZ: string;
        Phonenumber: string;
      }
    
      interface Ort {
        id: number;
        Name: string;
        PLZ: string;
      }
    
      const pfleger = await prisma.pfleger.findMany();
      const orte = await prisma.orte.findMany();
    return (
   
    <Table>
        <TableHead >
          <TableCell sx={{ color: "white" }}>Lastname</TableCell>
          <TableCell sx={{ color: "white" }}>Firstname</TableCell>
          <TableCell sx={{ color: "white" }}>Ort</TableCell>
          <TableCell sx={{ color: "white" }}>Phonenumber</TableCell>
        </TableHead>
        {pfleger.map((p) => {
          const ort = orte.find((o) => o.PLZ === p.PLZ);
          return (
            <TableRow key={p.id}>
              <TableCell>{p.LastName}</TableCell>
              <TableCell>{p.FirstName}</TableCell>
              <TableCell>{ort ? ort.Name : "Unknown"}</TableCell>
              <TableCell>{p.Phonenumber}</TableCell>
            </TableRow>
          );
        })}
      </Table>
  )
}

export default Pfleger