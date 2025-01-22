
import { prisma } from '@/db';
import { Table, TableHead, TableCell, TableRow, Button } from '@mui/material';
import React from 'react'
import axios from 'axios';
import { PflegerToken } from '../Pfleger/PflegerToken';


async function Ort() {

    interface Ort {
        id: number;
        Name: string;
        PLZ: string;
    }
    const orte = await prisma.orte.findMany();
    const pfleger = await prisma.pfleger.findMany();

    orte.forEach(async (o) => {
        let found = false;
        pfleger.forEach(async (p) => {
            if (p.PLZ == o.PLZ) {
                found = true;
            }
        });
        if (!found) {
            await prisma.orte.delete({
                where: {
                    id: o.id
                }
            });
        }
    }
    );
    //add missing locations that are in the Pfleger table
    pfleger.forEach(async (p) => {
        let found = false;
        orte.forEach(async (o) => {
            if (p.PLZ == o.PLZ) {
                found = true;
            }
        });
        if (!found) {
            const OrtName = await axios.get(`https://openplzapi.org/de/Localities?postalCode=${p.PLZ}`).then((response) => { return response.data[0].name });
            console.log(OrtName);
            await prisma.orte.create({
                data: {
                    Name: OrtName,
                    PLZ: p.PLZ,
                    created_at: new Date().toISOString()
                }
            });
        }
    }
    );

    return (
        <div>
            <PflegerToken />
            <Button sx={{ textTransform: "capitalize", marginRight: 1 }} variant="contained" color="primary" href='Ort'>
                Add missing locations
            </Button>
            <Table>
                <TableHead >
                    <TableCell >PLZ</TableCell>
                    <TableCell >Name</TableCell>

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
        </div>
    )
}

export default Ort