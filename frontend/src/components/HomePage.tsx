import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSocket } from "@/contexts/SocketProvider";
import { useTheme } from "@/contexts/ThemeContext";
import { Plus, Users, X } from "lucide-react";
import ButtonQuiz from "./ui/ButtonQuiz";

const HomePage = () => {
  const nav = useNavigate();
  const [join, setJoin] = useState(false);
  const [userName, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const { colors, isDarkMode } = useTheme();

  const { socket, setNickname } = useSocket();

  const joinRoom = () => {
    localStorage.setItem("roomId", roomId);
    setNickname(userName);
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
    <div className={`min-h-screen transition-colors duration-500 ${colors.background}`}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
              isDarkMode ? "bg-yellow-400" : "bg-yellow-300"
            } `}
          ></div>
          <div
            className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl ${
              isDarkMode ? "bg-yellow-500" : "bg-yellow-200"
            } `}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl ${
              isDarkMode ? "bg-yellow-300" : "bg-yellow-400"
            }`}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1
              className={`text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 ${colors.text} tracking-tight`}
            >
              <span className={`${colors.accent} drop-shadow-lg`}>Quiz</span>
              <span className="drop-shadow-lg">zify</span>
            </h1>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl ${colors.textSecondary} font-light leading-relaxed drop-shadow-sm`}
            >
              A place to create and conduct quizzes instantly using AI
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <ButtonQuiz
              onClick={() => setJoin(true)}
              variant="primary"
              >
              <Users className="w-6 h-6" />
              Join a Room
            </ButtonQuiz>

            <ButtonQuiz
              onClick={handleLogin}
              variant="secondary"
            >
              <Plus className="w-6 h-6" />
              Create Quiz
            </ButtonQuiz>
          </div>
        </div>
      </div>


      {/* Join Room Modal */}
      {join && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className={`${colors.surface} rounded-3xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in duration-300`}>

            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${colors.text}`}>Join a Room</h3>
              <button
                onClick={() => setJoin(false)}
                className={`cursor-pointer p-2 rounded-full ${colors.textSecondary} ${colors.surfaceHover} transition-colors duration-200`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your nickname"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${colors.border} ${colors.surface} ${colors.text} placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${colors.border} ${colors.surface} ${colors.text} placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 outline-none`}
                />
              </div>
            </div>


            <div className="flex gap-4 mt-8">
              <ButtonQuiz
                onClick={() => setJoin(false)}
                variant="secondary"
                className="flex-1 text-base py-3 cursor-pointer"
              >
                Cancel
              </ButtonQuiz>
              <ButtonQuiz
                onClick={joinRoom}
                variant="primary"
                className="flex-1 text-base py-3 cursor-pointer"
                disabled={!userName.trim() || !roomId.trim()}
              >
                Join Room
              </ButtonQuiz>
            </div>
          </div>
        </div>
      )}
      {/* <img src={Community} alt="" className="z-0" /> */}
    </div>
  );
};

export default HomePage;
