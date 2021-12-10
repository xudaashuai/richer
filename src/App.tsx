/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/display-name */
import { LobbyClient } from 'boardgame.io/client';
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SERVER } from './constant';
import LobbyPage from './pages/LobbyPage';
import LoginPage from './pages/LoginPage';
import MatchPage from './pages/MatchPage';

const lobbyClient = new LobbyClient({
  server: SERVER
});
export const LobbyContext = React.createContext<{
  lobbyClient: LobbyClient;
  name: string;
  playerID?: string;
  playerCredentials?: string;
  setName: (name: string) => void;
  setPlayerID: (playerID: string) => void;
  setPlayerCredentials: (playerCredentials: string) => void;
}>({
  lobbyClient,
  name: '',
  setName: () => {},
  setPlayerID: () => {},
  setPlayerCredentials: () => {},
  playerID: '',
  playerCredentials: ''
});

export default function App() {
  const [name, setName] = useState(localStorage.getItem('richer_name'));
  const [playerID, setPlayerID] = useState(localStorage.getItem('richer_playerID') || undefined);
  const [playerCredentials, setPlayerCredentials] = useState(
    localStorage.getItem('richer_playerCredentials') || undefined
  );
  return (
    <div className="max-w-4xl mx-auto h-full">
      <LobbyContext.Provider
        value={{
          lobbyClient,
          name,
          setName: (val) => {
            setName(val);
            localStorage.setItem('richer_name', val);
          },
          playerID,
          setPlayerID: (val) => {
            setPlayerID(val);
            localStorage.setItem('richer_playerID', val);
          },
          playerCredentials,
          setPlayerCredentials: (val) => {
            setPlayerCredentials(val);
            localStorage.setItem('richer_playerCredentials', val);
          }
        }}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/match" element={<LobbyPage />}></Route>
            <Route path="/match/:matchId" element={<MatchPage />}></Route>
          </Routes>
        </Router>
      </LobbyContext.Provider>
    </div>
  );
}
