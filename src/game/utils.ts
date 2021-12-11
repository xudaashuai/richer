import { Ctx, LobbyAPI } from 'boardgame.io';
import { GameData } from './game';
import { Player } from './players';
import { v4 as uuidv4 } from 'uuid';
export function getCurrentPlayer(G: GameData, ctx: Ctx) {
  return G.players[ctx.currentPlayer];
}

export function updatePlayerPosition(G: GameData, ctx: Ctx, player: Player, to: number) {
  player.position = to;
}

export function updatePlayerMoney(G: GameData, ctx: Ctx, player: Player, add: number) {
  sendMessage(
    `金钱从 ${player.money} ${add > 0 ? '增加' : '减少'} ${Math.abs(add)} 到 ${player.money + add}`,
    G,
    ctx,
    player.name
  );
  player.money += add;
  if (player.money <= 0) {
    sendMessage(`破产啦！`, G, ctx);
  }
}

export function sendMessage(message: string, G: GameData, ctx: Ctx, player?: string) {
  G.messages.push({
    content: message,
    timestamp: Date.now(),
    owner: player ?? ctx.currentPlayer,
    uuid: uuidv4()
  });
}
