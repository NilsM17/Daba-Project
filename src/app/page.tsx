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


  const tiere = await prisma.tiere.findMany();
  const tierart = await prisma.tierArten.findMany();
  const Futter = await prisma.futter.findMany();

  return (
    <Box>
      <h1 className={styles.title}> Welcome to Daba Project</h1>
      <Button variant="contained" color="primary" href="/Login">
        login
      </Button>
      <Table>
        <TableHead >
          <TableCell >Art</TableCell>
          <TableCell >Name</TableCell>
          <TableCell >Revier</TableCell>
          <TableCell >Gebaeude</TableCell>
          <TableCell >Fütterung</TableCell>
        </TableHead>
        {tiere.map((t) => {
          const tierarten = tierart.find((a) => t.Name === a.TierName);
          const futterTier = Futter.find((f) => f.TierArt === tierarten?.Art);


          const ZeitbisFutter = futterTier
            ? (() => {
              const [hours, minutes] = futterTier.Uhrzeit.split(":").map(Number); // Parse the Uhrzeit string
              const now = new Date();
              const currentTotalMinutes = now.getHours() * 60 + now.getMinutes(); // Convert current time to total minutes
              const targetTotalMinutes = hours * 60 + minutes; // Convert target time to total minutes

              let diffMinutes = targetTotalMinutes - currentTotalMinutes;

              // Handle cases where the time crosses midnight
              if (diffMinutes < 0) {
                diffMinutes += 24 * 60; // Add 24 hours (in minutes) to wrap around
              }

              const diffHours = Math.floor(diffMinutes / 60); // Calculate hours
              const remainingMinutes = diffMinutes % 60; // Calculate remaining minutes

              return `${diffHours} Stunden und ${remainingMinutes} Minuten`;
            })()
            : "Unknown";

          return (
            <TableRow key={t.id}>
              <TableCell>{tierarten ? tierarten.Art : "Unkown"}</TableCell>
              <TableCell>{t.Name}</TableCell>
              <TableCell>{tierarten ? tierarten.Revier : "Unkown"}</TableCell>
              <TableCell>{tierarten ? tierarten.Geb_ude : "Unkown"}</TableCell>
              <TableCell>{ZeitbisFutter}</TableCell>
            </TableRow>
          );
        })}
      </Table>
    </Box>
  );
}
