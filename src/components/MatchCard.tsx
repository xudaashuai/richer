import * as React from 'react';
import { LobbyAPI } from 'boardgame.io';
import { colors } from '../constant';
import { LobbyContext } from '../App';

interface MatchCardProps {
  match: LobbyAPI.Match;
  className?: string;
  onLeave: (match: LobbyAPI.Match, player: string) => void;
  onEnter: (match: LobbyAPI.Match) => void;
  onJoin: (match: LobbyAPI.Match) => void;
}

const MatchCard: React.FunctionComponent<MatchCardProps> = ({
  className,
  match,
  onEnter,
  onLeave,
  onJoin
}) => {
  const { name } = React.useContext(LobbyContext);
  const activePlayers = React.useMemo(
    () => match.players.filter((player) => player.name),
    [match.players]
  );
  const selfInRoom = React.useMemo(
    () => match.players.filter((player) => player.name === name)[0],
    [match.players, name]
  );
  return (
    <div
      className={`${className} rounded-lg w-full bg-gray-100 shadow-sm px-4 py-4 hover:shadow-xl`}>
      <p className="text-lg mb-2 text-center">房间名 - {match.setupData?.name}</p>
      <p className="mb-2">房间 id - {match.matchID}</p>
      <p className="mb-2">
        人数 - {activePlayers.length}/{match.players.length}
      </p>
      <div className="flex mb-4 flex-wrap">
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
      <div className="flex justify-between">
        {activePlayers.length !== match.players.length && !selfInRoom && (
          <button className="button w-full mr-4" onClick={() => onJoin(match)}>
            加入房间
          </button>
        )}
        {selfInRoom && (
          <button className="button w-full mr-4" onClick={() => onEnter(match)}>
            进入房间
          </button>
        )}
        {selfInRoom && (
          <button className="button w-full" onClick={() => onLeave(match, `${selfInRoom.id}`)}>
            离开房间
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
