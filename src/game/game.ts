import { Game } from 'boardgame.io';
import { isEmpty } from 'lodash';
import { Action, handleAction } from './actions';
import { handleArrival, handleThrough } from './arrival';
import { createDefaultMap, GameMap } from './map';
import { createPlayer } from './players';
import { Player } from './players';
import { getCurrentPlayer } from './utils';

export interface GameData {
  map: GameMap;
  players: {
    [key: string]: Player | undefined;
  };
  actions: {
    [key: string]: Action[];
  };
  messages: Message[];
}

export interface Message {
  content: string;
  timestamp: number;
  owner: string;
  uuid: string;
}

export const Richer: Game<GameData> = {
  name: 'richer',
  minPlayers: 1,
  setup: (ctx) => {
    const players: {
      [key: string]: Player;
    } = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
      players[`${i}`] = createPlayer(`${i}`, 6);
    }
    return { map: createDefaultMap(), players: players, actions: {}, messages: [] };
  },
  turn: {
    activePlayers: { currentPlayer: 'action' },
    onBegin(G, ctx) {
      const player = getCurrentPlayer(G, ctx);
      if (player.money < 0) {
        ctx.events.endTurn();
        return;
      }
      G.actions[ctx.currentPlayer] = [{ type: '前进！' }];
    },
    endIf(G, ctx) {
      return isEmpty(G.actions[ctx.currentPlayer]?.filter((item) => item.type !== '结束回合'));
    },
    stages: {
      action: {
        moves: {
          handleEvent(G, ctx, index: number) {
            const player = G.players[ctx.currentPlayer];
            const oldPosition = player.position;
            handleAction(G, ctx, player, G.actions[ctx.currentPlayer][index]);
            const newPosition = player.position;
            if (oldPosition !== newPosition) {
              handleArrival(G, ctx, player);
            }
          }
        }
      }
    }
  },
  endIf: (G, ctx) => {
    const activePlayers = Object.values(G.players).filter((p) => p.money > 0);
    if (activePlayers.length === 1) {
      return {
        winner: activePlayers[0].name
      };
    }
  }
};
