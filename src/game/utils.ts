import { Ctx, LobbyAPI } from 'boardgame.io';
import { GameData } from './game';
import { Player } from './players';

export function getCurrentPlayer(G: GameData, ctx: Ctx) {
  return G.players[ctx.currentPlayer];
}

export function updatePlayerPosition(G: GameData, ctx: Ctx, player: Player, to: number) {
  sendMessage(`从 ${player.position} 前进到 ${to}`, G, ctx);
  player.position = to;
}

export function updatePlayerMoney(G: GameData, ctx: Ctx, player: Player, add: number) {
  sendMessage(
    `金钱从 ${player.money} ${add > 0 ? '增加' : '减少'} ${Math.abs(add)} 到 ${player.money + add}`,
    G,
    ctx
  );
  player.money += add;
}

export function sendMessage(message: string, G: GameData, ctx: Ctx) {
  G.messages.push({
    content: message,
    timestamp: Date.now(),
    owner: ctx.currentPlayer
  });
}
