import * as React from 'react';
import { useState } from 'react';

function CreateRicherMatchButton({
  className,
  onCreate,
  children
}: {
  className?: string;
  onCreate: (params: { name: string; playerNum: number }) => Promise<void>;
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [playerNum, setPlayerNum] = useState(2);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button className={`button ${className}`} onClick={() => setShowModal(true)}>
        {children}
      </button>
      {showModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="flex flex-col h-full fixed w-full justify-center">
            <div className="mt-4 w-full px-4 flex justify-center">
              <div className="max-w-xl flex-1">
                <div className="inline-block align-bottom rounded-lg w-full bg-white p-4">
                  <div className="text-center font-bold mb-4 text-xl">创建游戏房间</div>
                  <label className="block mb-4">
                    <span>房间名称</span>
                    <input
                      type="text"
                      className="block w-full mt-1"
                      placeholder="房间名称"
                      value={name}
                      onChange={(e) => setName(e.target.value)}></input>
                  </label>
                  <label className="block mb-4">
                    <span>最大人数 (2 到 8)</span>
                    <input
                      type="number"
                      className="block w-full mt-1"
                      placeholder="最大人数"
                      value={playerNum}
                      onChange={(e) => setPlayerNum(+e.target.value)}></input>
                  </label>
                  <div>
                    <button
                      className="button w-full"
                      onClick={async () => {
                        await onCreate({
                          name,
                          playerNum
                        });
                        setShowModal(false);
                      }}>
                      创建房间！
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateRicherMatchButton;
