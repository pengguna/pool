import React, { useEffect, useState } from 'react';
import DataFetcher from "./DataFetcher";

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

export default function HistoryPage (props) {
    const [tableData, setTable] = useState([]);

    useEffect(() => {
        DataFetcher("history")
            .then(res => {
                // yikes this should be more robust
                setTable(res);
            })
    }, []);
    return <HistoryTable lines ={tableData} />
}



function HistoryTable(props)
{
    var counter = 0;
    var data = props.lines.map(str => {
        const arr = str.split(" ");
        counter++;
        return { date: arr[0], winner: arr[1], loser: arr[2], key: str+counter}
    });
    return (
      <Stack spacing={2}> 
          <h2>Game History</h2>
          <TableContainer>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Date</TableCell>
                  <TableCell >Winner</TableCell>
                  <TableCell >Loser</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((line) => (
                  <TableRow
                    key={line.key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{line.date}</TableCell>
                    <TableCell>{line.winner}</TableCell>
                    <TableCell>{line.loser}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
    );
}
