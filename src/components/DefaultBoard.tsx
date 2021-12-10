import * as React from 'react';
import { reverse } from 'lodash';
import BoardNode from './BoardNode';
import { MapNode, MapNodeType } from '../game/nodes';
import { GameData } from '../game/game';
import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import UI from './UI';
import AppContext from './AppContext';

const DefaultBoard: React.FunctionComponent<BoardProps<GameData>> = (props) => {
  const { G, ctx, moves, sendChatMessage } = props;
  const uiNodes = React.useMemo(() => {
    const map = G.map;
    const result: MapNode[][] = [];
    result.push(map.nodes.slice(0, map.width));
    for (let i = 1; i < map.height - 1; i++) {
      result.push([
        map.nodes[map.nodes.length - i],
        ...new Array(5).fill({ type: MapNodeType.EMPTY }),
        map.nodes[map.width + i - 1]
      ]);
    }
    result.push(
      reverse(map.nodes.slice(map.width + map.height - 2, map.height + map.width * 2 - 2))
    );
    return result;
  }, [G.map]);
  return (
    <AppContext.Provider value={{ ...props, G: { ...props.G } }}>
      <div className="relative container mx-auto flex flex-col items-center">
        <div className="relative">
          {uiNodes.map((nodes, index) => (
            <div className="flex" key={index}>
              {nodes.map((node, index) => (
                <BoardNode
                  key={index}
                  node={node}
                  players={Object.values(G.players).filter((p) => p.position === node.position)}
                />
              ))}
            </div>
          ))}
          <div
            className="absolute top-24 left-24 "
            style={{
              width: '30rem',
              height: '30rem'
            }}>
            <UI {...props} />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default DefaultBoard;
