import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// Elo Table
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

export default function AllStatsPage () {
    const [leaderboard, setLeaderboard] = useState(['']);

    useEffect(() => {
        fetch("http://localhost:5000/leaderboard")
            .then(res => res.json())
            .then(res => {
                // yikes this should be more robust
                console.log(res.data)
                if (res.data)
                {
                    res.data.sort((a,b) => a[1] < b[1])
                    setLeaderboard(res.data)
                }
                else
                {
                    setLeaderboard({ no: 1}) // probably not how to construct anon.
                }
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
              <h1>All Stats</h1>
            <Stack spacing={2} direction="column">
                <EloTable leaderboard={leaderboard} />
                <h2>Win Rates</h2>
            </Stack>
        </Grid>
    );
}



function EloTable (props)
{

                    //<TableCell align="right">{(100*(games[opp].wins/games[opp].total)).toFixed(2)}</TableCell>
    const data = props.leaderboard
    return (
      <Stack spacing={2}> 
          <h2>Elo Table</h2>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Player</TableCell>
                  <TableCell align="right">Elo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((player) => (
                  <TableRow
                    key={player}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell >{player[0]}</TableCell>
                    <TableCell align="right">{parseFloat(player[1]).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
    );
}
