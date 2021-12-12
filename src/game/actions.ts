import { Ctx } from 'boardgame.io';
import { handleThrough } from './arrival';
import {
  BuildingName,
  calculateBuyCost,
  calculateUpgradeCost,
  isEligibleToUpgrade
} from './building';
import { GameData } from './game';
import { BuildingNode } from './nodes';
import { Player } from './players';
import { sendMessage, updatePlayerMoney, updatePlayerPosition } from './utils';
export interface BuyAction {
  type: '购买';
  content?: string;
  payload: {
    buildingName: BuildingName;
  };
}

export interface UpgradeAction {
  type: '升级';
  content?: string;
}

export interface EndTurnAction {
  type: '结束回合';
  content?: string;
}

export interface MoveAction {
  type: '前进！';
  content?: string;
  payload?: {
    triggerThrough?: boolean;
    position?: number;
  };
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
  const result = calculateBuyCost(G, ctx, currentNode, player, action.payload.buildingName);
  if (result.money >= player.money) {
    return;
  }
  sendMessage(`购买了 ${player.position} 号土地 建造了${action.payload.buildingName}`, G, ctx);
  updatePlayerMoney(G, ctx, player, -result.money);
  currentNode.owner = player.name;
  currentNode.level += 1;
  currentNode.buildingName = action.payload.buildingName;
}

function handleUpgradeAction(G: GameData, ctx: Ctx, player: Player, action: UpgradeAction) {
  const currentNode = G.map.nodes[player.position] as BuildingNode;

  const ineligibleReason = isEligibleToUpgrade(G, ctx, currentNode, player);
  if (ineligibleReason) {
    sendMessage(ineligibleReason, G, ctx, player.name);
    return;
  }
  const result = calculateUpgradeCost(G, ctx, currentNode, player);

  sendMessage(
    `升级 ${player.position} 号土地的${currentNode.buildingName} 到 LV${currentNode.level + 1}`,
    G,
    ctx,
    player.name
  );
  updatePlayerMoney(G, ctx, player, -result.money);
  currentNode.owner = player.name;
  currentNode.level += 1;
}

function handleMoveAction(G: GameData, ctx: Ctx, player: Player, action: MoveAction) {
  let newPosition: number;
  if (action.payload?.position !== undefined) {
    newPosition = action.payload?.position;
    sendMessage(`传送到 ${newPosition}`, G, ctx);
  } else {
    const num = ctx.random.Die() + ctx.random.Die();
    newPosition = (G.players[player.name].position + num) % G.map.nodes.length;
    sendMessage(
      `丢出了 ${num}，从 ${G.players[player.name].position} 前进到 ${newPosition}`,
      G,
      ctx
    );
    for (let i = 1; i <= num; i++) {
      handleThrough(G, ctx, player, (G.players[player.name].position + i) % G.map.nodes.length);
    }
  }
  updatePlayerPosition(G, ctx, player, newPosition);
}
