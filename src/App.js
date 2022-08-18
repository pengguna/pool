import React from 'react';
import Button from "@mui/material/Button";
import {  Outlet } from "react-router-dom"
import Link from "@mui/material/Link";
import {createTheme, ThemeProvider } from '@mui/material/styles'

// TopNavBar
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './App.css';


const theme = createTheme({
    palette: {
        primary: { 
            main: '#af1a1c',
        },
        secondary: { 
//            main: '#3f3f3f',
            main: '#171717',
        },
    },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="AppRoot">
          <GlobalNav />
          <Outlet />
      </div>
    </ThemeProvider>
  );
}

export function Home() {
    return (
        <div>
          <h1>Home, this is a useless page.</h1>
        </div>
    );
}

// TODO: these should really be color="inherit" but for somereason that's red...
function GlobalNav() {
    return (
    <Box sx={{ flexGrow: 1 }} className="NavBar">
      <AppBar position="static">
        <Toolbar>
          <Button> 
            <Link href="/" color="rgb(255,255,255)" underline="hover" variant="h5">Home</Link>
          </Button>
          <Button>
            <Link href="/newgame" color="rgb(255,255,255)" underline="hover">New Game</Link>
          </Button>
          <Button>
            <Link href="/player" color="rgb(255,255,255)" underline="hover">Player Stats</Link>
          </Button>
          <Button>
            <Link href="/stats" color="rgb(255,255,255)" underline="hover">All Stats</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default App;
