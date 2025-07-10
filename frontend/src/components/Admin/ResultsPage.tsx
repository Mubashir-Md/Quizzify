import { useSocket } from "@/contexts/SocketProvider";
import { useEffect, useState } from "react";

interface Participant {
  nickname: string;
  socket: WebSocket;
  roomId: string;
  score: number;
}

const ResultsPage = () => {
  const { socket, latestMessage } = useSocket();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalScore, setTotalScore] = useState<number>();

  useEffect(() => {
    if (!latestMessage) return;

    const message = JSON.parse(latestMessage.data);
    if (message.type === "results") {
      setParticipants(message.payload.participants);
      setTotalScore(message.payload.totalScore)
    }
  }, []);

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-screen">
        {participants?.map((p, idx)=>(
            <div key={idx}>
                <p className="text-2xl">{p.nickname}: {p.score} out of {totalScore}</p>
            </div>
        ))}
    </div>
    )
};

export default ResultsPage;
