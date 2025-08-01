import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Copy, FileText, Play } from "lucide-react";
import ButtonQuiz from "../ui/ButtonQuiz";

interface Quiz {
  _id: string;
  topic: string;
  difficulty: string;
  roomId: string;
  questions: {
    question: string;
    choices: string[];
    answer: string;
  }[];
}

const ProfilePage = () => {
  const { user, session } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const nav = useNavigate();
  const [quizId, setQuizId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [copiedRoomId, setCopiedRoomId] = useState('');

  const { isDarkMode } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    if (isDarkMode) {
      switch (difficulty) {
        case "Easy":
          return "bg-yellow-400/20 text-yellow-300 border-yellow-400/30";
        case "Medium":
          return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
        case "Hard":
          return "bg-yellow-600/20 text-yellow-100 border-yellow-600/30";
        default:
          return "bg-gray-700 text-gray-300 border-gray-600";
      }
    } else {
      switch (difficulty) {
        case "Easy":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Medium":
          return "bg-yellow-200 text-yellow-900 border-yellow-300";
        case "Hard":
          return "bg-yellow-300 text-yellow-900 border-yellow-400";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    }
  };

  const handleCopyRoomId = async (roomId: string) => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(roomId);
      setTimeout(() => setCopiedRoomId(''), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  useEffect(() => {
    if (!session) {
      nav("/auth");
      return;
    }
  }, [session, nav]);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/myQuizzes`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
        setQuizzes(res.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (session) fetchUserQuizzes();
  }, [session]);

  if (!user)
    return (
      <div className={`text-white h-screen flex items-center justify-center text-center text-8xl ${isDarkMode ? "bg-black text-yellow-300" : "bg-white text-yellow-500"}`}>
        Loading...
      </div>
    );

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
        <div className="container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-10 text-center">Your Quizzes</h1>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className={`group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-800 hover:border-yellow-400/50' 
                  : 'bg-white border-gray-200 hover:border-yellow-400'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-xl font-semibold leading-tight transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-white group-hover:text-yellow-400' 
                      : 'text-black group-hover:text-yellow-600'
                  }`}>
                    {quiz.topic}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                {/* Quiz Stats */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {quiz.questions.length}
                        </span> Questions
                      </span>
                    </div>
                    
                  </div>
                  
                  {/* Room ID */}
                  <div className={`flex items-center justify-between rounded-lg p-3 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-800 group-hover:bg-gray-700' 
                      : 'bg-gray-50 group-hover:bg-yellow-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Room ID:
                      </span>
                      <span className={`font-mono text-sm font-semibold px-2 py-1 rounded border ${
                        isDarkMode 
                          ? 'text-white bg-black border-gray-700' 
                          : 'text-black bg-white border-gray-200'
                      }`}>
                        {quiz.roomId}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyRoomId(quiz.roomId)}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        isDarkMode 
                          ? 'hover:bg-gray-600 text-gray-400 hover:text-yellow-400' 
                          : 'hover:bg-white hover:shadow-sm text-gray-500 hover:text-yellow-600'
                      }`}
                      title="Copy Room ID"
                    >
                      {copiedRoomId === quiz.roomId ? (
                        <Check className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 flex justify-between space-x-4">
                <ButtonQuiz
                  onClick={() => {
                    
                  }}
                  className="w-full border-yellow-300"
                  variant="secondary"
                >
                  <Play className="w-4 h-4" />
                  View Quiz
                </ButtonQuiz>
                <ButtonQuiz
                  onClick={() => {
                    setShowDialog(true);
                    setQuizId(quiz._id);
                    setRoomId(quiz.roomId);
                  }}
                  className="w-full"
                >
                  <Play className="w-4 h-4" />
                  Launch Quiz
                </ButtonQuiz>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <FileText className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              No Quizzes Available
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create your first quiz to get started.
            </p>
          </div>
        )}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 w-full max-w-md shadow-2xl ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Launch Quiz
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quiz ID: <span className="font-mono font-semibold">{quizId}</span><br />
              Room ID: <span className="font-mono font-semibold">{roomId}</span>
            </p>
            <div className="flex gap-3">
              <ButtonQuiz
                onClick={() => setShowDialog(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </ButtonQuiz>
              <ButtonQuiz
                onClick={() => nav(`/admin/launch/${quizId}/${roomId}`)}
                className="flex-1"
              >
                Confirm Launch
              </ButtonQuiz>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProfilePage;
