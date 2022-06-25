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

//Player Stats
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export function NewGamePage () {
    const options = ['callum', 'johnny'];
    const [players, setPlayers] = useState(['']);

    useEffect(() => {
        fetch("http://localhost:5000/player_list")
            .then(res => res.json())
            .then(res => {
                // yikes this should be more robust
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
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />
    </div>
  );
}

export function PlayerStatsPage () {
    const [player, choosePlayer] = useState('noSeletion');
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
              <h2>Player Lookup</h2>
            <Stack spacing={2} direction="row">
                <AllPlayersList choosePlayer={choosePlayer} players={players}/>
                <PlayerSpecificStats player={player} />
            </Stack>
        </Grid>
    );
}

function AllPlayersList (props)
{
  const [selectedIndex, setSelectedIndex] = useState("");

  const handleListItemClick = (event, index) => {
    props.choosePlayer(index);
    setSelectedIndex(index);
  };

  return (
    <Box 
      sx={{ width: '100%', maxWidth: 500, bgcolor: '#FC1303' }}
      >
      <List>
      {props.players.map(player => {
        return (
            <ListItemButton
              selected={selectedIndex === player}
              onClick={(event) => handleListItemClick(event, player)}
              key={player}
            >
              <ListItemText primary={player} />
            </ListItemButton>
        );
      })}
      </List>
    </Box>
  );
}

function PlayerSpecificStats (props) 
{
    const [playerData, setPlayerData] = useState({})
    // const data = {
    //     elo: 1,
    //     name: "callum",
    //     games: {
    //         marin: {
    //             total: 4,
    //             wins: 3,
    //         },
    //         johnny: {
    //             total: 6,
    //             wins: 2,
    //         },
    //     }
    // };
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*', 
            },
        };

        // FIXME: better noSelection handling. This string is trash.
        if (props.player !== 'noSelection')
        {
            fetch("http://127.0.0.1:5000/player?" + new URLSearchParams({ name: props.player, }), requestOptions)
                .then(res => res.json())
                .then(res => setPlayerData(res))
        }
    }, [props.player]);
    return (
        <div>
        {props.player === "noSelection" ? "Select Player" : <PlayerSpecificStatsTable gamedata={playerData} />}
        </div>
    );
        
}

function PlayerSpecificStatsTable (props)
{
      // {props.gamedata.games.map(data => {
      //   return (
      //       <ListItem disablePadding>
      //         <ListItemText primary={data.opp} />
      //       </ListItem>
      //   );
      // })}
    if (Object.keys(props.gamedata).length === 0)
    {
        return (<div></div>);
    }
    const games = props.gamedata.games;
  return (
    <Stack spacing={2}> 
        <h2>{props.gamedata.name} ({props.gamedata.elo})</h2>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell >Opponent</TableCell>
                <TableCell align="right">Won Games</TableCell>
                <TableCell align="right">Total Games</TableCell>
                <TableCell align="right">Win Rate&nbsp;(%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(games).map((opp) => (
                <TableRow
                  key={opp}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {opp}
                  </TableCell>
                  <TableCell align="right">{games[opp].wins}</TableCell>
                  <TableCell align="right">{games[opp].total}</TableCell>
                  <TableCell align="right">{(100*(games[opp].wins/games[opp].total)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
  );
}

export default App;
