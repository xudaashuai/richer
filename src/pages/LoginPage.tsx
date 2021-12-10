import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../App';

const LoginPage: React.FunctionComponent = () => {
  const { lobbyClient, setName } = React.useContext(LobbyContext);
  const [newName, setNewName] = React.useState(localStorage.getItem('richer_name') || '');
  const navigate = useNavigate();
  const enterLobby = () => {
    if (newName.length > 0) {
      setName(newName);
      localStorage.setItem('richer_name', newName);
      navigate('/match');
    }
  };
  return (
    <div className="flex w-full h-full items-center">
      <div className="flex flex-col flex-1 items-center w-2/3">
        <input
          type="text"
          className="mt-1 block w-full"
          placeholder="输入你的名字"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="button mt-4 w-full" onClick={enterLobby}>
          进入游戏大厅
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
