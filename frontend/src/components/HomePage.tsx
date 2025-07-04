import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { X } from "lucide-react";

const HomePage = () => {
  const nav = useNavigate();
  const [join, setJoin] = useState(false);

  const joinRoom = () => {
    setJoin(false);
    nav("/waiting");
  };

  const handleLogin = ()=>{
    nav("/admin/auth")
  }
  

  

  return (
    <div className="flex justify-center space-y-4 items-center flex-col bg-black text-white h-screen">
      <p className="text-4xl">Quizzify - Organize instant quizzes</p>
      <p className="text-2xl">
        A place to create and conduct quizzes instantly using AI
      </p>
      <div className="flex items-center justify-around w-1/3 my-4">
        <Button
          className="text-2xl py-7 px-6 cursor-pointer"
          onClick={() => setJoin(true)}
        >
          Join a room
        </Button>
        <Button
          className="text-2xl py-7 px-6 cursor-pointer"
          onClick={handleLogin}
        >
          Create a quiz?
        </Button>
      </div>

      {join && (
        <div className="border boder-white p-3 m-2 rounded-xl flex flex-col w-1/4 justify-around">
          <header className="flex justify-between items-center m-2">
            <h1 className="text-xl">Enter a room</h1>
            <span className="cursor-pointer" onClick={() => setJoin(false)}>
              <X />
            </span>
          </header>
          <input
            required
            type="text"
            placeholder="Enter room id"
            className="border border-gray-400 rounded-md p-2 m-2"
          />
          <Button
            className="m-2 border border-white cursor-pointer"
            onClick={joinRoom}
          >
            Join room
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
