import { LobbyAPI } from 'boardgame.io';
import * as React from 'react';
import { colors } from '../constant';
function MatchWaitng({ match, onStart }: { match: LobbyAPI.Match; onStart: () => void }) {
  const activePlayers = React.useMemo(
    () => match.players.filter((player) => player.name),
    [match.players]
  );
  return (
    <div className="flex justify-center h-full">
      <div className="flex flex-col justify-center">
        <div className="text-center text-2xl mb-4">房间 {match.matchID}</div>
        <div className="text-center text-xl mb-4">
          正在等待其他玩家加入 {activePlayers.length}/{match.players.length}
        </div>
        <div className="flex justify-between mb-4">
          {match.players.map((player, index, array) => (
            <div
              className={`${index !== array.length - 1 && 'mr-2'} ${
                player.name ? `bg-${colors[index]}-300` : 'bg-gray-300'
              } rounded-full w-24 h-24 flex flex-col justify-center`}
              key={index}>
              <div className="text-center font-bold">{player.name}</div>
            </div>
          ))}
        </div>
        {
          <button className="button" onClick={onStart}>
            开始游戏
          </button>
        }
      </div>
    </div>
  );
}

export default MatchWaitng;
