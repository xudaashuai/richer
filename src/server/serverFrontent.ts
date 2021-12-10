/* eslint-env node */
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
const app = new Koa();

app.use(serve(path.join(__dirname, '../../dist')));

app.listen(8001);
