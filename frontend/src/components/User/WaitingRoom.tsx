import { useEffect, useState } from "react";

const WaitingRoom = () => {
  const roomId = localStorage.getItem("roomId");
  const [webSocket, setWebSocket] = useState<WebSocket>();
  console.log(roomId);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setWebSocket(ws);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
    };
  }, []);

  return (
    <div className="bg-black text-white">
      <h1>Let everyone join</h1>
      <h1>roomid</h1>
      {/* mapp all users profile pics or just show nick names */}
      <button>Start Quiz</button>
    </div>
  );
};

export default WaitingRoom;
