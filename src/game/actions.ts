import { Ctx } from 'boardgame.io';
import { map } from 'lodash';
import { BuildingType } from './building';
import { GameData } from './game';
import { BuildingNode } from './nodes';
import { Player } from './players';
import { sendMessage, updatePlayerMoney, updatePlayerPosition } from './utils';
export interface BuyAction {
  type: '购买';
  payload: {
    buildingType: BuildingType;
  };
}

export interface UpgradeAction {
  type: '升级';
}

export interface EndTurnAction {
  type: '结束回合';
}

export interface MoveAction {
  type: '前进！';
}

export type Action = BuyAction | UpgradeAction | EndTurnAction | MoveAction;

export function handleAction(G: GameData, ctx: Ctx, player: Player, action: Action) {
  switch (action.type) {
    case '购买':
      handleBuyAction(G, ctx, player, action);
      break;
    case '升级':
      handleUpgradeAction(G, ctx, player, action);
      break;
    case '前进！':
      handleMoveAction(G, ctx, player, action);
      break;
    case '结束回合':
      ctx.events.endTurn();
      break;
  }
  G.actions[player.name] = [];
}
function handleBuyAction(G: GameData, ctx: Ctx, player: Player, action: BuyAction) {
  const currentNode = G.map.nodes[player.position] as BuildingNode;

  sendMessage(`购买了 ${player.position} 号土地 建造了${action.payload.buildingType}`, G, ctx);
  updatePlayerMoney(G, ctx, player, -currentNode.cost);
  currentNode.owner = player.name;
  currentNode.level += 1;
  currentNode.buildingType = action.payload.buildingType;
  currentNode.cost *= 1.2;
}

function handleUpgradeAction(G: GameData, ctx: Ctx, player: Player, action: UpgradeAction) {
  const currentNode = G.map.nodes[player.position] as BuildingNode;

  if (currentNode.level >= currentNode.maxLevel) {
    return;
  }
  updatePlayerMoney(G, ctx, player, -currentNode.cost);
  currentNode.owner = player.name;
  currentNode.level += 1;
  currentNode.cost *= 1.2;
}

function handleMoveAction(G: GameData, ctx: Ctx, player: Player, action: MoveAction) {
  updatePlayerPosition(
    G,
    ctx,
    player,
    (G.players[player.name].position + ctx.random.Die()) % G.map.nodes.length
  );
}
