import React from 'react';
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom"

// TopNavBar
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';





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
          <Button color="inherit">
            <Link to="/player">Player Stats</Link>
          </Button>
          <Button color="inherit">
            <Link to="/stats">All Stats</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default App;
