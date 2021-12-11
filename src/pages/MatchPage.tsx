import * as React from 'react';
import DefaultBoard from '../components/DefaultBoard';
import { Client } from 'boardgame.io/client';
import { LobbyContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER } from '../constant';
import { ClientState, _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { GameData, Richer } from '../game/game';
import { Ctx, LobbyAPI } from 'boardgame.io';
import MatchWaitng from '../components/MatchWaitng';
import { useInterval } from 'usehooks-ts';

export interface MatchContextState {
  match: LobbyAPI.Match;
  players: {
    [key: string]: {
      name?: string;
    };
  };
}
export const MatchContext = React.createContext<MatchContextState>(
  {} as unknown as MatchContextState
);

function MatchPage() {
  const { lobbyClient, name, playerCredentials, playerID, setPlayerCredentials, setPlayerID } =
    React.useContext(LobbyContext);
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = React.useState<ClientState<GameData>>(null);
  const [gameClient, setGameClient] = React.useState<_ClientImpl<GameData>>(null);
  const [matchData, setMatchData] = React.useState<LobbyAPI.Match>();
  const [stage, setStage] = React.useState('waiting');

  // 定时刷新房间信息
  useInterval(
    async () => {
      const data = await lobbyClient.getMatch('richer', matchId);
      setMatchData(data);
    },
    stage === 'waiting' ? 1000 : null
  );

  React.useEffect(() => {
    console.log([lobbyClient, matchId, name, navigate, playerCredentials, playerID, gameClient]);
    async function enterMatch() {
      if (gameClient) {
        return;
      }
      try {
        const matchData = await lobbyClient.getMatch('richer', matchId);
        setMatchData(matchData);
        const selfInRoom = matchData.players.filter((player) => player.name === name)[0];
        if (selfInRoom && playerCredentials) {
          const client = Client<GameData>({
            game: Richer,
            multiplayer: SocketIO({
              server: SERVER
            }),
            matchID: matchId,
            playerID: `${selfInRoom.id}`,
            credentials: playerCredentials,
            debug: true
          });
          setGameClient(client);
        } else {
          // 试图加入房间
          const freeSeat = matchData.players.find((player) => !player.name);
          if (!freeSeat) {
            throw new Error('没有座位啦');
          }
          const match = await lobbyClient.joinMatch('richer', matchId, {
            playerName: name,
            playerID: `${freeSeat.id}`
          });
          const gameClient = Client<GameData>({
            game: Richer,
            multiplayer: SocketIO({
              server: SERVER
            }),
            matchID: matchId,
            playerID: match.playerID,
            credentials: match.playerCredentials,
            debug: true
          });
          setGameClient(gameClient);
          setPlayerID(match.playerID);
          setPlayerCredentials(match.playerCredentials);
        }
      } catch (e) {
        // 加入房间失败，返回列表页面
        console.log(e);
        navigate('/match');
      }
    }
    enterMatch();
  }, [
    gameClient,
    lobbyClient,
    matchId,
    name,
    navigate,
    playerCredentials,
    playerID,
    setPlayerCredentials,
    setPlayerID
  ]);
  React.useEffect(() => {
    if (gameClient) {
      setState(gameClient.getState());
      gameClient.subscribe(() => {
        const newState = gameClient.getState();
        console.log(newState);
        setState(newState);
      });
    }
  }, [gameClient]);
  return (
    <>
      {matchData && stage === 'waiting' && (
        <MatchWaitng
          match={matchData}
          onStart={() => {
            setStage('gaming');
            gameClient.start();
            setState(gameClient.getState());
          }}
        />
      )}
      {state && stage === 'gaming' && (
        <>
          {gameClient && state.G && (
            <MatchContext.Provider
              value={{
                match: matchData,
                players: matchData.players.reduce((pre, cur) => {
                  pre[`${cur.id}`] = cur;
                  return pre;
                }, {} as { [key: string]: { name?: string } })
              }}>
              <DefaultBoard
                {...state}
                matchID={matchId}
                playerID={playerID}
                moves={gameClient.moves}
                events={gameClient.events}
                reset={gameClient.reset}
                undo={gameClient.undo}
                redo={gameClient.redo}
                sendChatMessage={gameClient.sendChatMessage}
                chatMessages={gameClient.chatMessages}
                isMultiplayer
              />
            </MatchContext.Provider>
          )}
        </>
      )}
    </>
  );
}

export default MatchPage;
