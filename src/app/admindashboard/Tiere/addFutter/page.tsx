'use client';

import { Table, TableHead, TableRow, TableCell, TextField, Button } from '@mui/material';
import React from 'react';
import { addData } from './addData';
import { TimePicker } from 'rsuite'; // Import the RSuite TimePicker
import 'rsuite/dist/rsuite.min.css'; // Ensure RSuite styles are included

function AddFutterung() {
    const [tierArt, setTierArt] = React.useState<string>("");
    const [futter, setFutter] = React.useState<string>("");
    const [uhrzeit, setUhrzeit] = React.useState<string>("");

    // Format date to HH:mm
    const formatTime = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Handle time change
    const handleTimeChange = (time: Date | null) => {
        setUhrzeit(formatTime(time)); // Store formatted time as HH:mm
    };

    return (
        <div className="add-futterung-container">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tier Art</TableCell>
                        <TableCell>Futter</TableCell>
                        <TableCell>Uhrzeit</TableCell>
                        <TableCell>ADD</TableCell>
                    </TableRow>
                </TableHead>
                <TableRow>
                    <TableCell>
                        <TextField
                            id="tierName"
                            variant="outlined"
                            onChange={(e) => setTierArt(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            id="futter"
                            variant="outlined"
                            onChange={(e) => setFutter(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TimePicker
                            className="time-picker"
                            format="HH:mm"
                            onChange={handleTimeChange}
                            size="lg" // Large size for better visibility
                            placeholder="Select Time"
                            cleanable={false} // Prevent clearing the time
                            style={{ width: '120px' }} // Adjust width if needed
                        />
                    </TableCell>
                    <TableCell>
                        <Button
                            sx={{ background: "white", color: "light-blue" }}
                            onClick={() => addData(tierArt, futter, uhrzeit)}
                            disabled={!tierArt || !futter || !uhrzeit}
                        >
                            ADD
                        </Button>
                    </TableCell>
                </TableRow>
            </Table>
        </div>
    );
}

export default AddFutterung;
