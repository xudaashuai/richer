import * as React from 'react';

import { Lobby } from 'boardgame.io/react';
import { SERVER } from './constant';
import { Richer } from './game/game';
import DefaultBoard from './components/DefaultBoard';

export default function App() {
  return (
    <Lobby
      gameServer={SERVER}
      lobbyServer={SERVER}
      gameComponents={[{ game: Richer, board: DefaultBoard }]}
    />
  );
}
