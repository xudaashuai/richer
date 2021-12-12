import { LobbyAPI } from 'boardgame.io';
import * as React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LobbyContext } from '../App';
import CreateRicherMatchButton from '../components/CreateRicherMatchButton';
import MatchCard from '../components/MatchCard';

function LobbyPage() {
  const [games, setGames] = useState<string[]>([]);
  const [gameName, setGameName] = useState('richer');
  const [playerNum, setPlayerNum] = useState(2);
  const { lobbyClient, name, setName, playerID, playerCredentials } =
    React.useContext(LobbyContext);
  const navigate = useNavigate();
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

  const selfInMatch: LobbyAPI.Match | undefined = React.useMemo(() => {
    return matches.find((match) => match.players.find((p) => p.name === name) !== undefined);
  }, [matches, name]);
  React.useEffect(() => {
    lobbyClient.listGames().then((games) => {
      setGames(games);
      setGameName(games[0]);
    });
    if (!name) {
      navigate('/');
    }
  }, [lobbyClient, name, navigate]);

  const loadMatches = React.useCallback(() => {
    lobbyClient
      .listMatches(gameName, {
        isGameover: false
      })
      .then((matchList) => setMatches(matchList.matches));
  }, [gameName, lobbyClient]);

  React.useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const createGame = async ({ name, playerNum }: { name: string; playerNum: number }) => {
    const match = await lobbyClient.createMatch(gameName, {
      numPlayers: playerNum,
      setupData: {
        name
      }
    });
    navigate(`/match/${match.matchID}`);
  };
  const leaveMatch = (match: LobbyAPI.Match, playerID: string): void => {
    lobbyClient
      .leaveMatch('richer', match.matchID, {
        playerID,
        credentials: playerCredentials
      })
      .then(() => {
        loadMatches();
      });
  };
  const enterMatch = (match: LobbyAPI.Match): void => navigate(`/match/${match.matchID}`);

  return (
    <div className="mt-4 px-2">
      <div className="text-center mb-4 text-xl font-bold">Hi {name}</div>
      <div className="flex mb-4">
        <select
          className="flex-1 mr-2 text-center"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}>
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
        <button className="button flex-shrink-0 w-1/4 mr-2" onClick={loadMatches}>
          刷新
        </button>
        <CreateRicherMatchButton className="button flex-shrink-0 w-1/4" onCreate={createGame}>
          创建房间
        </CreateRicherMatchButton>
      </div>

      <div>
        {selfInMatch && (
          <>
            <div className="text-xl mb-2">你加入的房间</div>
            <MatchCard
              className="mb-4"
              match={selfInMatch}
              onLeave={leaveMatch}
              onJoin={enterMatch}
              onEnter={enterMatch}
            />
          </>
        )}

        <div className="text-xl mb-2">其他房间</div>
        {matches
          .filter((match) => match.matchID !== selfInMatch?.matchID)
          .map((match) => (
            <MatchCard
              className="mb-4"
              key={match.matchID}
              match={match}
              onLeave={leaveMatch}
              onJoin={enterMatch}
              onEnter={enterMatch}
            />
          ))}
      </div>
    </div>
  );
}

export default LobbyPage;
