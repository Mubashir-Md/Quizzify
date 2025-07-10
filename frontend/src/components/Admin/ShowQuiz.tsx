import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ShowQuiz = () => {
  const quizData = JSON.parse(localStorage.getItem("quiz") || "");
  const { session } = useAuth();
  const nav = useNavigate();
  
  const saveQuiz = async () => {

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/saveQuiz`, quizData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      })

      nav(`/admin/profile`);

    } catch (error) {
        console.error("Error saving quiz:", error);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-evenly bg-black">
      <Card className="bg-white h-[80vh] overflow-auto p-3 w-1/2">
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
      <Button className="bg-white text-black hover:bg-grey cursor-pointer" onClick={saveQuiz}>Save Quiz</Button>
    </div>
  );
};

export default ShowQuiz;
