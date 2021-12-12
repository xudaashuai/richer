import * as React from 'react';
import {
  BuildingName,
  calculateFee,
  calculateUpgradeCost,
  CalculatorResult,
  getEligibleBuildingNames,
  isEligibleToUpgrade
} from '../game/building';
import { BuildingNode, MapNode, MapNodeType } from '../game/nodes';
import { Player } from '../game/players';
import { MatchContext } from '../pages/MatchPage';
import AppContext from './AppContext';
interface BoardNodeProps {
  node: MapNode;
  players?: Player[];
}

const BoardNode: React.FunctionComponent<BoardNodeProps> = ({ node, players = [] }) => {
  let content;
  switch (node.type) {
    case MapNodeType.EMPTY:
      return <div className="w-24 h-24"></div>;
    case MapNodeType.空地:
    default:
      content = <DefaultBoardNode node={node} players={players} />;
      break;
  }
  return <div className="w-24 h-24 px-2 py-2">{content}</div>;
};

const DefaultBoardNode: React.FunctionComponent<{
  node: MapNode;
  players: Player[];
}> = ({ node, players }) => {
  const { G } = React.useContext(AppContext);
  let owner, name, tooltip;
  switch (node.type) {
    case MapNodeType.空地:
      owner = G.players[(node as BuildingNode).owner];
      name = node.buildingName ?? node.eligibleBuildingCategories.join() ?? node.type;
      tooltip = <BuildingToolTip node={node} />;
      break;
    default:
      name = node.type;
      break;
  }
  let displayClassName = '';
  if (node.position === 5) {
    displayClassName = 'top-24 right-0';
  } else if (node.position < 7) {
    displayClassName = 'top-24 left-0';
  } else if (node.position < 13) {
    displayClassName = 'top-0 right-24';
  } else if (node.position === 13) {
    displayClassName = 'bottom-24 right-0';
  } else if (node.position < 18) {
    displayClassName = 'bottom-24 left-0';
  } else if (node.position < 24) {
    displayClassName = 'top-0 left-24';
  }
  return (
    <div
      className={`relative ${tooltip && 'has-tooltip'} w-full h-full bg-${owner?.color || 'gray'}-${
        ((node as BuildingNode).level || 1) * 100 + 0
      } rounded-xl`}>
      <div className="top-0 left-0 table w-full h-full">
        <div className="table-cell align-middle w-full h-full text-center text-gray-200 text-4xl font-bold">
          {node.position}
        </div>
      </div>
      <div className={`absolute top-0 left-0 w-full h-full`}>
        <div className="text-center pt-2">{name}</div>
        <div>
          {players.map((p) => (
            <PlayerBadge className="z-10 relative" key={p.name} player={p}></PlayerBadge>
          ))}
        </div>
        {tooltip && (
          <div className={`tooltip rounded shadow-lg p-1 bg-gray-100 w-40 ${displayClassName}`}>
            {tooltip}
          </div>
        )}
      </div>
    </div>
  );
};

const BuildingToolTip = ({ node }: { node: BuildingNode }) => {
  const { G, ctx, playerID } = React.useContext(AppContext);
  const owner = G.players[(node as BuildingNode).owner];
  const player = G.players[playerID];
  let fee: CalculatorResult, upgradeCost: CalculatorResult, eligibleBuildingNames: BuildingName[];
  if (owner) {
    fee = calculateFee(G, ctx, node, player);
    if (isEligibleToUpgrade(G, ctx, node) === undefined) {
      upgradeCost = calculateUpgradeCost(G, ctx, node, player);
    }
  } else {
    eligibleBuildingNames = getEligibleBuildingNames(G, ctx, node, player);
  }

  return (
    <>
      {owner && (
        <div>
          老板: <PlayerBadge player={owner} />
        </div>
      )}
      {node.level > 0 && <div>等级：{node.level}</div>}
      {fee && <div>停留收费：{fee.money}</div>}
      {upgradeCost && <div>升级花费：{upgradeCost.money}</div>}
      {eligibleBuildingNames && <div>可建造：{eligibleBuildingNames.join('，')}</div>}
    </>
  );
};

export function PlayerBadge({
  player,
  playerName,
  className
}: {
  player?: Player;
  playerName?: string;
  className?: string;
}) {
  const { players } = React.useContext(MatchContext);
  return (
    <span className={`${className} bg-${player.color}-300 ring-1 px-3 rounded-full mx-0.5 text-xs`}>
      {players[playerName || player.name].name}
    </span>
  );
}

export default BoardNode;
