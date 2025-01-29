'use client';
import { Table, TableHead, TableRow, TableCell, TextField, Button } from '@mui/material'
import React from 'react'
import { addData } from './addData';

function addTiere() {
    const [tierName, setTierName] = React.useState("");
    const [pfleger, setPfleger] = React.useState("");
    const [tierArt, setTierArt] = React.useState("");
    const [gebaeude, setGebaeude] = React.useState("");
    const [revier, setRevier] = React.useState("");
    return (
        <div> <Table>
            <TableHead>
                <TableRow>
                    <TableCell >TierName</TableCell>
                    <TableCell >PflegerLastName</TableCell>
                    <TableCell>Tierart</TableCell>
                    <TableCell>Gebäude</TableCell>
                    <TableCell>Revier</TableCell>
                    <TableCell >ADD</TableCell>
                </TableRow>
            </TableHead>
            <TableRow>
                <TableCell><TextField id='tierName' variant='outlined' onChange={(e) => { setTierName(e.target.value) }}></TextField></TableCell>
                <TableCell><TextField id='pfleger' variant='outlined' onChange={(e) => { setPfleger(e.target.value) }}></TextField></TableCell>
                <TableCell><TextField id='tierart' variant='outlined' onChange={(e) => { setTierArt(e.target.value) }}></TextField></TableCell>
                <TableCell><TextField id='gebaeude' variant='outlined' onChange={(e) => { setGebaeude(e.target.value) }}></TextField></TableCell>
                <TableCell><TextField id='revier' variant='outlined' onChange={(e) => { setRevier(e.target.value) }}></TextField></TableCell>

                <TableCell><Button
                    sx={{ background: "white", color: "light-blue" }}
                    onClick={() => addData(tierName, pfleger, tierArt, gebaeude, revier)}
                    disabled={!tierName || !pfleger || !tierArt || !gebaeude || !revier}
                >
                    ADD
                </Button></TableCell>
            </TableRow>
        </Table></div>
    )
}

export default addTiere