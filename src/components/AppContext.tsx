import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import * as React from 'react';
import { GameData } from '../game/game';

export default React.createContext<BoardProps<GameData>>({} as unknown as any);
