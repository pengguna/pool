import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import { Navigate } from "react-router-dom";

// Drop down
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Autocomplete';
import DataFetcher from './DataFetcher';

export default function NewGamePage (props) {
    const [players, setPlayers] = useState(['']);

    useEffect(() => {
        DataFetcher("player_list")
            .then(res => {
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
              <h2>New Game Entry</h2>
              <NewGameCollector players={players}/>
        </Grid>
    );
}

function NewGameCollector (props) {

    const [winner, setWinner] = useState('');
    const [loser, setLoser] = useState('');
    const [submitted, setSubmission] = useState(false);

    const handlePost = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*', 
            },
        };
        // TODO: add these in as some other shit
        DataFetcher("newgame?" + new URLSearchParams({ winner, loser, }), requestOptions)
            .then(res => setSubmission(true))
    };
    return submitted ? 
        (<Navigate to='/stats' replace={true} />) 
    :
            (
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
