import * as React from 'react';
import { FEE } from '../game/constants';
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
    case MapNodeType.工业:
    case MapNodeType.商业:
    case MapNodeType.住宅:
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
    case MapNodeType.工业:
    case MapNodeType.商业:
    case MapNodeType.住宅:
      owner = G.players[(node as BuildingNode).owner];
      name = node.buildingType ?? node.type;
      tooltip = <BuildingToolTip node={node} />;
      break;
    default:
      name = node.type;
      break;
  }
  return (
    <div
      className={`${tooltip && 'has-tooltip'} w-full h-full bg-${owner?.color || 'gray'}-${
        ((node as BuildingNode).level || 1) * 100 + 0
      } rounded-xl`}>
      <div className="text-center pt-2">{name}</div>
      <div>
        {players.map((p) => (
          <PlayerBadge key={p.name} player={p}></PlayerBadge>
        ))}
      </div>
      {tooltip && (
        <div className="tooltip rounded shadow-lg p-1 bg-gray-100 left-24 top-0 w-40">
          {tooltip}
        </div>
      )}
    </div>
  );
};

const BuildingToolTip = ({ node }: { node: BuildingNode }) => {
  const { G } = React.useContext(AppContext);
  const owner = G.players[(node as BuildingNode).owner];
  return (
    <>
      {owner && (
        <>
          <div>老板: {owner.name}</div>
          <div>等级：{node.level}</div>
          <div>停留收费：{FEE[node.buildingType!][node.level]}</div>
          {node.level != node.maxLevel && <div>升级花费：{node.cost}</div>}
        </>
      )}
    </>
  );
};

export function PlayerBadge({ player }: { player: Player }) {
  const { players } = React.useContext(MatchContext);
  return (
    <span className={`bg-${player.color}-300 ring-1 px-3 rounded-full mx-0.5`}>
      {players[player.name].name}
    </span>
  );
}

export default BoardNode;