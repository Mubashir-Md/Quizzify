import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ShowQuiz = () => {
  const quizData = JSON.parse(localStorage.getItem("quiz") || "");
  const { session, user } = useAuth();
  const nav = useNavigate();
  
  const saveQuiz = async () => {

    try {
      const res = await axios.post("http://localhost:3000/saveQuiz", quizData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      })
      const { roomId, quizId } = res.data;

      localStorage.setItem("roomId", roomId);
      localStorage.setItem("quizId", quizId);

      nav(`/admin/profile?user=${user?.email}`);

    } catch (error) {
        console.error("Error saving quiz:", error);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-evenly bg-black">
      <Card className="bg-white h-2/3 overflow-auto p-3">
        {quizData.questions.map((item: any, index: number) => {
          return (
            <>
            <div className="m-2">
              <p key={index} className="text-black">
                {index + 1}. {item.question}
              </p>
              <ul className="list-inside my-2">
                {item.choices.map((i: any) => {
                  return <li className="text-[#616161]"> - {i}</li>;
                })}
              </ul>
              <p className="italic">Answer: {item.answer}</p>
            </div>
          <hr />
          </>
          );
        })}
      </Card>
      <Button className="bg-white text-black hover:bg-grey" onClick={saveQuiz}>Save Quiz</Button>
    </div>
  );
};

export default ShowQuiz;
