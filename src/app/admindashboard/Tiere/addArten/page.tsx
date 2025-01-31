'use client';
import { Button, Tab, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import React from 'react'
import { addData } from './addData'

function addArten() {

    const [tierArt, setArt] = React.useState("");
    const [gebaeude, setGebaeude] = React.useState("");
    const [revier, setRevier] = React.useState("");
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>

                        <TableCell>Tierart</TableCell>
                        <TableCell>Gebäude</TableCell>
                        <TableCell>Revier</TableCell>
                        <TableCell>ADD</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableCell>
                        <TextField id='tierArt' variant='outlined' onChange={(e) => setArt(e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <TextField id='Gebaeude' variant='outlined' onChange={(e) => setGebaeude(e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <TextField id='Revier' variant='outlined' onChange={(e) => setRevier(e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <Button sx={{ background: "white", color: "light-blue" }}
                            onClick={() => addData( tierArt, gebaeude, revier)}
                            disabled={ !tierArt || !gebaeude || !revier}>ADD</Button>
                    </TableCell>
                </TableBody>
            </Table>
        </div>
    )
}

export default addArten