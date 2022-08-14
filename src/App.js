import React from 'react';
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom"
import {createTheme, ThemeProvider } from '@mui/material/styles'

// TopNavBar
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

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

function GlobalNav() {
    return (
    <Box sx={{ flexGrow: 1 }} className="NavBar">
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
          <Button>
            <Link to="/newgame">New Game</Link>
          </Button>
          <Button>
            <Link to="/player">Player Stats</Link>
          </Button>
          <Button>
            <Link to="/stats">All Stats</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default App;
