import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import { reverse } from 'lodash';
import * as React from 'react';
import { GameData } from '../game/game';
import { Player } from '../game/players';
import { MatchContext } from '../pages/MatchPage';
import AppContext from './AppContext';
import { PlayerBadge } from './BoardNode';

const UI: React.FunctionComponent<BoardProps<GameData>> = (props) => {
  const { G: gameData, ctx } = props;
  const { players } = React.useContext(MatchContext);
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-around my-1 mx-0.5">
          {Object.values(gameData.players).map((player) => (
            <PlayerCard key={player.name} player={player} />
          ))}
        </div>
        <div className="text-lg text-center">
          {ctx.currentPlayer === props.playerID
            ? `你的回合！`
            : `现在是 玩家 ${players[ctx.currentPlayer].name} 的回合`}
        </div>
        {ctx.currentPlayer === props.playerID && (
          <div>
            {(gameData.actions[ctx.currentPlayer] || []).map((action, index) => (
              <button
                className="py-2 px-4 bg-green-500 mt-2 text-white font-semibold rounded-lg shadow-md focus:outline-none w-full"
                key={index}
                onClick={() => props.moves.handleEvent(index)}>
                {action.type}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-auto h-48 rounded-lg bg-gray-300 p-4">
        {[...gameData.messages].reverse().map((m) => (
          <div key={m.timestamp}>
            <PlayerBadge player={gameData.players[m.owner]}></PlayerBadge> -{'>'} {m.content}
          </div>
        ))}
      </div>
    </div>
  );
};

function PlayerCard({ player }: { player: Player }) {
  const { ctx } = React.useContext(AppContext);
  const { players } = React.useContext(MatchContext);
  return (
    <span
      className={`bg-${player.color}-300 p-2 m-1 rounded flex-1 ${
        ctx.currentPlayer === player.name && 'ring-2'
      }`}
      key={player.name}>
      <div>玩家 {players[player.name].name}</div>
      <div>现金 {player.money}</div>
    </span>
  );
}

export default UI;
