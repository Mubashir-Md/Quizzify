import { useSocket } from "@/contexts/SocketProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
  const [users, setUsers] = useState<string[]>([]);
  const { latestMessage } = useSocket();
  const nav = useNavigate();

  useEffect(() => {
    if (!latestMessage) return;

    const parsed = JSON.parse(latestMessage.data);

    if(parsed.type === "participants"){
      setUsers([...parsed.payload.users])
      console.log(users);
      
    }

    if (parsed.type === "question") {
      nav("/questions"); // Or however you're showing the first question
    }
  }, [latestMessage]);

  return (
    <div className="bg-black text-white h-screen flex flex-col space-y-4 justify-center items-center">
      <h1>Let everyone join</h1>
      {users.map((u, idx)=>(
        <div key={idx} className=" text-black w-full flex flex-row items-center justify-center">
          <p className="p-4 rounded-xl bg-white m-2">{u}</p>
        </div>
      ))}
    </div>
  );
};

export default WaitingRoom;
