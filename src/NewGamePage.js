import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

// Drop down
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Autocomplete';

export default function NewGamePage () {
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
