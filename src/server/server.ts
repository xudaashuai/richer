/* eslint-env node */
import { Server, Origins } from 'boardgame.io/server';
import { Richer } from '../game/game';

const server = Server({
  games: [Richer],
  origins: [Origins.LOCALHOST]
});

server.run(8000);
