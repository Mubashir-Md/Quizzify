import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useSocket } from "@/contexts/SocketProvider";

const LaunchQuiz = () => {

  const { roomId, quizId } = useParams();
  const [users, setUsers] = useState<string[]>([])
  const { socket, latestMessage } = useSocket();
  const nav = useNavigate();

  const startQuiz = () => {
    if (!socket || !roomId || !quizId) {
      console.error("Missing socket or identifiers");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "question",
        payload: {
          roomId,
          currentIndex: -1
        },
      })
    );
    nav(`/admin/startQuiz/${quizId}/${roomId}`);
  };

  useEffect(() => {
    if(!latestMessage) return;

    const parsed = JSON.parse(latestMessage.data);

    if(parsed.type === "participants"){
      setUsers([...parsed.payload.users])
      console.log(users);
      
    }
  }, [latestMessage])
  

  useEffect(()=>{
    if (!socket || !roomId || !quizId) {
      console.error("Missing socket or identifiers");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "start",
        payload: {
          roomId,
          quizId,
        },
      })
    );
  }, [])

  return (
    <div className="flex flex-col items-center justify-center pt-10 bg-black text-white h-screen w-full space-y-5">
      <p className="text-2xl">Launching quiz soon</p>
      <p className="text-2xl flex items-center">
        Join room: <span className="text-4xl mx-2 underline"> {roomId}</span>
      </p>
      {users.map((u)=>(
        <div className=" text-black flex items-center justify-center w-full">
          <p className="px-3 py-2 rounded-full bg-white m-2 ">{u}</p>
        </div>
      ))}
      <Button
        className="border-white border cursor-pointer"
        onClick={startQuiz}
      >
        Start Quiz
      </Button>
    </div>
  );
};

export default LaunchQuiz;
