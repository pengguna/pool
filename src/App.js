import logo from './logo.svg';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Pool Game </h1>
      < NewGameCollector />
      </header>
    </div>
  );
}

function NewGameCollector () {

    const [winner, setWinner] = useState('');
    const [loser, setLoser] = useState('');
    const handlePost = () => {
        const requestOptions = {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify({ winner, loser,}),
        };
        fetch("http://localhost:8043", requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
    };
    return (
        <Stack spacing={2} direction="row">
            <TextField id="outlined-basic" label="Winner" variant="outlined" value={winner} onChange={(e) => {setWinner(e.target.value)}} />
            <TextField id="outlined-basic" label="Loser" variant="outlined" value={loser} onChange={(e) => {setLoser(e.target.value)}} />
            <Button variant="outlined" onClick={handlePost}>Submit</Button>
        </Stack>
    )
}

export default App;
