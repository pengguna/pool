import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Home }  from './App';
import NewGamePage from './NewGamePage.js';
import PlayerStatsPage from './PlayerStatsPage.js';
import AllStatsPage from './AllStatsPage.js';
import HistoryPage from './HistoryPage.js';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
// react router v6 docs:
// https://reactrouter.com/docs/en/v6/getting-started/overview
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} /> 
        <Route path="newgame" element={<NewGamePage />}>
        </Route>
        <Route path="player" element={<PlayerStatsPage />}>
        </Route>
        <Route path="history" element={<HistoryPage />}>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
