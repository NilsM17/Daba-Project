'use client';

import { Box, TextField, Button } from '@mui/material'
import React from 'react'
import { login } from './login';
import { setToken } from '../dashboard/checkToken';

function loginpage() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

  return (
    <Box>
        <TextField
            id="username"
            label="Username"
            variant="outlined"
            onChange={(e) => { setUsername(e.target.value) }}
        />
        <TextField
            id="password"
            label="Password"
            variant="outlined"
            onChange={(e) => { setPassword(e.target.value) }}
            type="password"
        />
        <Button
            sx={{ background: "white", color: "light-blue" }}
            onClick={() => {
                login(username, password).then((token) => {
                    if (token) {
                        setToken(token);
                        console.log(token);
                        localStorage.setItem('bearerToken', token);
                        window.location.href = '/dashboard';
                    } else {
                        alert('Login failed');
                    }
                });
            }}
            disabled={!username || !password}
        >
            Login
        </Button>
    </Box>
  )
}

export default loginpage