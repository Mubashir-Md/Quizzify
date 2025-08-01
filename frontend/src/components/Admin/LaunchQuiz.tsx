import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonQuiz from "../ui/ButtonQuiz";
import { useSocket } from "@/contexts/SocketProvider";
import { useTheme } from "@/contexts/ThemeContext";

const LaunchQuiz = () => {

  const { roomId, quizId } = useParams();
  const [users, setUsers] = useState<string[]>([])
  const { socket, latestMessage } = useSocket();
  const nav = useNavigate();
  const {isDarkMode} = useTheme()

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
    <div className={`flex flex-col items-center justify-center ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen w-full space-y-10`}>
      <p className={`text-5xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} text-shadow-2xs text-shadow-yellow-300`}>Launching quiz soon</p>
      <p className="text-5xl flex items-center">
        Room ID: <span className="text-7xl mx-2 underline"> {roomId}</span>
      </p>
      {users.map((u)=>(
        <div className=" text-black flex items-center justify-center w-full">
          <p className="px-3 py-2 rounded-full bg-white m-2 ">{u}</p>
        </div>
      ))}
      <ButtonQuiz
        className="border-white border cursor-pointer"
        onClick={startQuiz}
        variant="primary"
      >
        Start Quiz
      </ButtonQuiz>
    </div>
  );
};

export default LaunchQuiz;
