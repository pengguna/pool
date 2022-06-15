import logo from './logo.svg';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom"

// TopNavBar
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// NG page
import Grid from '@mui/material/Grid';

import './App.css';


function App() {
  return (
    <div className="AppRoot">
      <GlobalNav />
      <Outlet />
    </div>
  );
}

export function Home() {
    return (
        <div>
          <h1>Home, this is a useless page.</h1>
        </div>
    );
}

function GlobalNav() {
    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Button variant="outlined">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/">Home</Link>
            </Typography>
          </Button>
          <Button color="inherit">
            <Link to="/newgame">New Game</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export function NewGamePage () {
    console.log('loaded????')
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{minHeight: '100vh' }}
        >
              <h2>New Game Entry</h2>
              <NewGameCollector/>
        </Grid>
    );
}

function NewGameCollector () {

    const [winner, setWinner] = useState('');
    const [loser, setLoser] = useState('');
    const handlePost = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*', 
            },
        };
        fetch("http://127.0.0.1:5000/newgame?" + new URLSearchParams({ winner, loser, }), requestOptions)
            .then(res => res.json())
            .then(res => console.log(res))
    };
    return (
        <Stack spacing={2} direction="row">
            <TextField id="outlined-basic" label="Winner" variant="outlined" value={winner} onChange={(e) => {setWinner(e.target.value)}} />
            <TextField id="outlined-basic" label="Loser" variant="outlined" value={loser} onChange={(e) => {setLoser(e.target.value)}} />
            <Button variant="outlined" onClick={handlePost}>Submit</Button>
        </Stack>
    )
}

export default App;
