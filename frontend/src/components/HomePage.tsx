import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { useSocket } from "@/contexts/SocketProvider";

const HomePage = () => {
  const nav = useNavigate();
  const [join, setJoin] = useState(false);
  const [userName, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  
  const { socket, setNickname } = useSocket();
  
  const joinRoom = () => {
    localStorage.setItem("roomId", roomId)
    setNickname(userName)
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "join",
        payload: {
          nickname: userName,
          roomId,
        },
      })
    );
    nav("/waiting");
  };

  const handleLogin = () => {
    nav("/auth");
  };

  return (
    <div className="flex justify-center space-y-4 items-center flex-col bg-black text-white h-screen">
      <p className="text-4xl">Quizzify - Organize instant quizzes</p>
      <p className="text-2xl">
        A place to create and conduct quizzes instantly using AI
      </p>
      <div className="flex items-center justify-around w-1/3 my-4">
        <Button
          className="text-2xl py-7 px-6 cursor-pointer border border-yellow-200 mr-4"
          onClick={() => setJoin(true)}
        >
          Join a room
        </Button>
        <Button
          className="text-2xl py-7 px-6 cursor-pointer border border-white"
          onClick={handleLogin}
        >
          Create a quiz?
        </Button>
      </div>

      {join && (
        <Dialog open={join} onOpenChange={setJoin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a room</DialogTitle>
              <DialogDescription>Enter a room to play quiz</DialogDescription>
            </DialogHeader>

            <Input
              required
              type="text"
              placeholder="Your nickname"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              required
              type="text"
              placeholder="Enter room id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <DialogFooter>
              <Button
                className="border border-black cursor-pointer"
                onClick={() => setJoin(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                className="border border-white cursor-pointer"
                onClick={joinRoom}
                variant={"default"}
              >
                Join room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HomePage;
