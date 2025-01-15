import Image from "next/image";
import styles from "./page.module.css";
//import material UI buttons and icons
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { PrismaClient } from '@prisma/client';
import { useEffect, useState } from 'react';

import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import { prisma } from "@/db";

export default async function Home() {
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
    <Box>
      <h1 className={styles.title}> Welcome to Daba Project</h1>
      <Button sx={{ textTransform: "capitalize", marginRight: 1 }}  variant="contained" color="primary" href="/Pfleger" >
        Pfleger
      </Button>
      <Button sx={{ textTransform: "capitalize", marginRight: 1 }} variant="contained" color="primary" href="/Ort">
        Orte
      </Button>
      <Button sx={{ textTransform: "capitalize" }} variant="contained" color="primary" href="/Tiere">
        Tiere
      </Button>
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
    </Box>
  );
}
