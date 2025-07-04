import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid3X3, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Quiz {
  _id: string;
  topic: string;
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
  const [view, setView] = useState<"grid" | "row">("grid");
  const nav = useNavigate();

  useEffect(() => {
    if (!session) {
      nav("/admin/auth");
    }
  }, [session, nav]);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/myQuizzes", {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        setQuizzes(res.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (session) fetchUserQuizzes();
  }, [session]);

  if (!user)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="bg-black min-h-screen px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Welcome, {user.email}</h1>
        <p className="text-sm mb-6 text-gray-400">Here are your quizzes:</p>

        <div className="flex items-center justify-between mb-4">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v: any) => v && setView(v as "grid" | "row")}
          >
            <ToggleGroupItem value="grid" aria-label="Grid View">
              <Grid3X3 className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="row" aria-label="Row View">
              <List className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div
          className={`gap-4 ${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {quizzes.map((quiz) => (
            <Card
              key={quiz._id}
              className="bg-white text-black hover:scale-[1.01] transition-all cursor-pointer"
              onClick={() => nav(`/quiz/${quiz._id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {quiz.topic}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Questions: {quiz.questions.length}
                </p>
                <p className="text-sm text-gray-600">Room ID: {quiz.roomId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
