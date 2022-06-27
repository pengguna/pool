import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

export default function AllStatsPage () {
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
              <h1>All Stats</h1>
            <Stack spacing={2} direction="column">
                <h2>Elo Board</h2>
                <h2>Win Rates</h2>
            </Stack>
        </Grid>
    );
}
