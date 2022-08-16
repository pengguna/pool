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

// Historical Chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DataFetcher from "./DataFetcher.js";

export default function AllStatsPage () {
    const [leaderboard, setLeaderboard] = useState(['']);
    const [historicalElo, setHistorical] = useState({});

    useEffect(() => {
        DataFetcher('leaderboard')
            .then(res => {
                // yikes this should be more robust
                if (res)
                {
                    res.sort((a,b) => a[1] < b[1])
                    setLeaderboard(res)
                }
                else
                {
                    console.log('weird res is: ', res)
                    setLeaderboard({ no: 1}) 
                }
            })
        // also need wr data
        DataFetcher('historical_elo')
            .then(res => {
                setHistorical(res)
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
                <HistoricalElo historicalElo={historicalElo} />
            </Stack>
        </Grid>
    );
}



function EloTable (props)
{

                    //<TableCell align="right">{(100*(games[opp].wins/games[opp].total)).toFixed(2)}</TableCell>
    const data = props.leaderboard
    return (data && (data.length > 0)) ? (
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
    )
    :
        (<div>oopsie woopsie lil fucky wucky</div>);
}


function HistoricalElo (props)
{
    const data = props.historicalElo

    return (data && Object.keys(data).length) > 0 ?
        (
            <LineChart
                style={{background:'white'}}
                width={500}
                height={300}
                data={data.data}
                margin={{
                    top: 30,
                    right: 30,
                    left: 15,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.names.map(name => (
                    <Line key={name} type="monotone" dataKey={name} />
                ))}
            </LineChart>
        ) 
    :
        (<div>lil fucked up bit of data here...</div>)
}






















