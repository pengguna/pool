import React, { useEffect, useState } from 'react';

//Player Stats
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// Tables
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// extra
import Box from '@mui/material/Box';
import DataFetcher from "./DataFetcher";

export default function PlayerStatsPage () {
    const [player, choosePlayer] = useState('noSelection');
    const [players, setPlayers] = useState(['']);

    useEffect(() => {
        DataFetcher("player_list")
            .then(res => {
                // yikes this should be more robust
                setPlayers(res.players)
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
      sx={{ borderRadius: '16px', border: 1, height: '100%'}}
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
        // FIXME: better noSelection handling. This string is trash.
        if (props.player !== 'noSelection')
        {
            DataFetcher("player?" + new URLSearchParams({ name: props.player, }))
                .then(res => 
                    {
                        console.log(res)
                        setPlayerData(res)
                    })
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
        <TableContainer>
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
