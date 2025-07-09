import { useSocket } from "@/contexts/SocketProvider";
import React, { useEffect, useState } from "react";


const UserResults = () => {
  const { socket, latestMessage } = useSocket();
  const [score, setScore] = useState<number>();
  const [totalScore, setTotalScore] = useState<number>();

  useEffect(() => {
    if (!latestMessage) return;

    const message = JSON.parse(latestMessage.data);
    if (message.type === "results") {
      setScore(message.payload.score);
      setTotalScore(message.payload.totalScore);
    }
  }, []);

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center text-3xl">
        Your score is {score} out of {totalScore}
    </div>
    )
};

export default UserResults;
