/* eslint-env node */
import { Server, Origins } from 'boardgame.io/server';
import { Richer } from '../game/game';
import path from 'path';
import serve from 'koa-static';

const server = Server({
  games: [Richer],
  origins: [Origins.LOCALHOST]
});

const frontEndAppBuildPath = path.resolve(__dirname, '../../dist');
server.app.use(serve(frontEndAppBuildPath));

server.run({
  port: 80,
  callback: () => {
    server.app.use(
      async (ctx, next) =>
        await serve(frontEndAppBuildPath)(Object.assign(ctx, { path: 'index.html' }), next)
    );
  }
});
