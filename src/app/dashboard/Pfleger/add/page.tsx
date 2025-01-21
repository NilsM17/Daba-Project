'use client';
import { Table, TableHead, TableCell, TableRow, TextField, Button } from '@mui/material'
import React from 'react'
import { addData } from './addData';
import { checkToken } from '../../checkToken';


function PflegerAdd() {
  const [lastname, setLastname] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [ort, setOrt] = React.useState("");
  const [phonenumber, setPhonenumber] = React.useState("");


  return (
    <div>Pfleger Hinzufügen
      <Table>
        <TableHead>
          <TableRow>
            <TableCell >Lastname</TableCell>
            <TableCell >Firstname</TableCell>
            <TableCell >Ort</TableCell>
            <TableCell >Phonenumber</TableCell>
            <TableCell >ADD</TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell><TextField  id='lastname' variant='outlined' onChange={(e) => { setLastname(e.target.value) }}></TextField></TableCell>
          <TableCell><TextField  id='firstname' variant='outlined' onChange={(e) => { setFirstname(e.target.value) }}></TextField></TableCell>
          <TableCell><TextField  id='ort' variant='outlined' onChange={(e) => { setOrt(e.target.value) }}></TextField></TableCell>
          <TableCell><TextField  id='phonenumber' variant='outlined' onChange={(e) => { setPhonenumber(e.target.value) }}></TextField></TableCell>
          <TableCell><Button
            sx={{ background: "white", color: "light-blue" }}
            onClick={() => addData(lastname, firstname, phonenumber, ort)}
            disabled={!lastname || !firstname || !ort || !phonenumber}
          >
            ADD
          </Button></TableCell>
        </TableRow>
      </Table>
    </div>
  )
}

export default PflegerAdd;
