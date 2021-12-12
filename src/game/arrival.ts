import { Ctx } from 'boardgame.io';
import { Action, handleAction } from './actions';
import {
  BuildingName,
  calculateBuyCost,
  calculateFee,
  calculateUpgradeCost,
  CalculatorResult,
  getEligibleBuildingNames,
  isEligibleToUpgrade
} from './building';
import { BuildingNode, MapNodeType, SubwayNode } from './nodes';
import { Player } from './players';
import { sendMessage, updatePlayerMoney } from './utils';
import { GameData } from './game';

export function handleThrough(G: GameData, ctx: Ctx, player: Player, position: number) {
  const node = G.map.nodes[position];
  switch (node.type) {
    case MapNodeType.起点:
      sendMessage('经过起点 增加 200块钱', G, ctx);
      updatePlayerMoney(G, ctx, player, 200);
  }
}

export function handleArrival(G: GameData, ctx: Ctx, player: Player) {
  const node = G.map.nodes[player.position];
  let actions: Action[] = [];
  switch (node.type) {
    case MapNodeType.空地:
      actions = handleArrivalBuildingNode(G, ctx, node, player);
      break;
    case MapNodeType.地铁:
      actions = handleArrivalSubwayNode(G, ctx, node, player);
      break;
  }
  if (actions.length === 0) {
    ctx.events.endTurn();
  }
  G.actions[player.name] = actions;
}

function handleArrivalSubwayNode(
  G: GameData,
  ctx: Ctx,
  node: SubwayNode,
  player: Player
): Action[] {
  handleAction(G, ctx, player, {
    type: '前进！',
    payload: {
      triggerThrough: false,
      position: node.nextPosition
    }
  });
  return [];
}

function handleArrivalBuildingNode(G: GameData, ctx: Ctx, node: BuildingNode, player: Player) {
  let actions: Action[] = [];
  const owner = G.players[node.owner];
  // 无主
  if (owner === undefined) {
    actions = getEligibleBuildingNames(G, ctx, node, player)
      .map((name) => [calculateBuyCost(G, ctx, node, player, name), name])
      .map(([result, name]: [CalculatorResult, BuildingName]) =>
        result.money < player.money
          ? {
              type: '购买',
              content: `建造${name}，花费 ${result.money}`,
              payload: {
                buildingName: name
              }
            }
          : undefined
      );
  }

  // 自己的地
  else if (owner.name === player.name) {
    if (isEligibleToUpgrade(G, ctx, node, player) === undefined) {
      const result = calculateUpgradeCost(G, ctx, node, player);
      if (player.money > result.money) {
        actions.push({
          type: '升级'
        });
      }
    }
  }

  // 别人的地
  else {
    const result = calculateFee(G, ctx, node, player);
    const cost = Math.min(result.money, player.money);

    sendMessage(`到达 ${node.position} 支付过路费 ${cost}`, G, ctx);
    updatePlayerMoney(G, ctx, owner, cost);
    updatePlayerMoney(G, ctx, player, -cost);
  }
  if (actions.length > 0) {
    actions.push({
      type: '结束回合'
    });
  }
  return actions;
}
