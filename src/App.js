import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
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

// Drop down
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Autocomplete';

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
    const options = ['callum', 'johnny'];
    const [players, setPlayers] = useState(['']);

    useEffect(() => {
        fetch("http://localhost:5000/player_list")
            .then(res => res.json())
            .then(res => {
                // yikes this should be more robust
                console.log(res.data.players)
                setPlayers(res.data.players)
            })
    }, []);

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
              <NewGameCollector players={players}/>
        </Grid>
    );
}

function NewGameCollector (props) {

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
            <ControllableInput label="Winner" players={props.players} value={winner} setValue={setWinner}/>
            <ControllableInput label="Loser" players={props.players} value={loser} setValue={setLoser}/>
            <Button variant="outlined" onClick={handlePost}>Submit</Button>
        </Stack>
    )
}

function ControllableInput (props) {
  const [value, setValue] = React.useState(props.players[0]);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div>
      <Select
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          props.setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={props.players}
        sx={{ width: 200 }}
        renderInput={(params) => <TextField {...params} label="Winner" />}
      />
    </div>
  );
}

export default App;
