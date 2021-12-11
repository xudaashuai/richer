import { Ctx, Game } from 'boardgame.io';
import { isEmpty } from 'lodash';
import { Action, handleAction } from './actions';
import { FEE } from './constants';
import { createDefaultMap, GameMap } from './map/map';
import { BuildingNode, MapNode, MapNodeType } from './nodes';
import { createPlayer } from './players';
import { Player } from './players';
import { getCurrentPlayer, sendMessage, updatePlayerMoney } from './utils';

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

function handleArrival(G: GameData, ctx: Ctx, player: Player) {
  const node = G.map.nodes[player.position];
  let actions: Action[] = [];
  switch (node.type) {
    case MapNodeType.工业:
    case MapNodeType.商业:
    case MapNodeType.住宅:
      actions = handleArrivalBuildingNode(G, ctx, node, player);
  }
  if (actions.length === 0) {
    ctx.events.endTurn();
  }
  G.actions[player.name] = actions;
}
function handleArrivalBuildingNode(G: GameData, ctx: Ctx, node: BuildingNode, player: Player) {
  let actions: Action[] = [];
  const owner = G.players[node.owner];
  // 无主
  if (owner === undefined) {
    if (player.money > node.cost) {
      actions = node.validBuildingTypes.map((type) => ({
        type: '购买',
        content: `建造${type}，花费 ${node.cost}`,
        payload: {
          buildingType: type
        }
      }));
    }
  }
  // 自己的地
  else if (owner.name === player.name) {
    if (player.money > node.cost) {
      actions.push({
        type: '升级'
      });
    }
  }
  // 别人的地
  else {
    const cost = Math.min(FEE[node.buildingType][node.level], player.money);

    sendMessage(`到达 ${node.position} 支付过路费 ${cost}`, G, ctx);
    updatePlayerMoney(G, ctx, owner, cost);
    updatePlayerMoney(G, ctx, player, -cost);
  }
  actions.push({
    type: '结束回合'
  });
  return actions;
}
