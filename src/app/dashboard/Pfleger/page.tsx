import { prisma } from '@/db';
import { Box, Button, Table, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import React from 'react'


interface Pfleger {
  id: string;
  created_at: Date;
  LastName: string;
  FirstName: string;
  PLZ: string;
  Phonenumber: string;
}

interface Ort {
  id: string;
  Name: string;
  PLZ: string;
}

async function Pfleger() {

  const pfleger = await prisma.pfleger.findMany();
  const orte = await prisma.orte.findMany();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}>

        <Button sx={{ textTransform: "capitalize", marginRight: 1 }} variant="contained" color="primary" href="Pfleger/add" >
          ADD
        </Button>
      </Box>
      <Table>
        <TableHead >
          <TableCell >Lastname</TableCell>
          <TableCell >Firstname</TableCell>
          <TableCell >Ort</TableCell>
          <TableCell >Phonenumber</TableCell>
        </TableHead>
        {pfleger.map((p) => {
          const ort = orte.find((o) => o.PLZ === p.PLZ);
          return (
            <TableRow key={p.id}>
              <TableCell>{p.LastName}</TableCell>
              <TableCell>{p.FirstName}</TableCell>
              <TableCell>{ort ? ort.Name : "Unkown"}</TableCell>
              <TableCell>{p.Phonenumber}</TableCell>
            </TableRow>
          );
        })}
      </Table>
    </Box>
  )
}


export default Pfleger