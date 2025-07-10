import { useSocket } from "@/contexts/SocketProvider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import clsx from "clsx";
import { Button } from "../ui/button";

const StartingQuiz = () => {
  const { quizId, roomId } = useParams();
  const { socket, latestMessage } = useSocket();
  const [question, setQuestion] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);
  const [index, setIndex] = useState<number>();
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [nextQuestion, setNextQuestion] = useState<boolean>(false);
  const [revealAnswer, setRevealAnswer] = useState<boolean>(true);
  const [done, setDone] = useState<boolean>(false);

  const nav = useNavigate()
  

  const showAnswer = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "reveal",
        payload: {
          roomId,
          question,
        },
      })
    );

    setNextQuestion(true);
    setRevealAnswer(false);
  };

  const showNext = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "question",
        payload: {
          roomId,
          currentIndex: index,
        },
      })
    );
    setNextQuestion(false);
    setCorrectAnswer("");
    setRevealAnswer(true);
  };


  const showResults = ()=>{
    if (!socket) return;
    
    
    socket.send(
      JSON.stringify({
        type: "results",
        payload: {
          roomId,
        },
      })
      );
      
      nav(`/admin/${roomId}/results`)
  }

  useEffect(() => {
    if (!latestMessage) return;

    const message = JSON.parse(latestMessage.data);
    if (message.type === "question") {
      setQuestion(message.payload.question);
      setChoices(message.payload.choices);
      setIndex(message.payload.index);
    }

    if (message.type === "answer") {
      setCorrectAnswer(message.payload.correctAnswer);
    }

    if (message.type === "done") {
      setDone(true);
    }

   

    console.log(latestMessage);
  }, [latestMessage]);

  console.log(latestMessage);

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-screen p-4 space-y-10">
      {!done ? (
        <>
          <p className="text-4xl text-center max-w-4xl">{question}</p>

          <RadioGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {choices?.map((choice, idx) => (
              <Label
                key={idx}
                htmlFor={`choice-${idx}`}
                className={clsx(
                  "flex items-center justify-center text-xl font-semibold",
                  "p-8 rounded-2xl cursor-pointer transition-all duration-200",
                  "bg-white text-black border-4 border-transparent",
                  "hover:bg-yellow-200",
                  correctAnswer === choice &&
                    "bg-green-300 text-black underline"
                )}
              >
                <RadioGroupItem
                  value={choice}
                  id={`choice-${idx}`}
                  className="sr-only"
                />
                {choice}
              </Label>
            ))}
          </RadioGroup>

          {correctAnswer && (
            <p className="text-2xl text-center max-w-4xl">
              The answer is: <span className="underline">{correctAnswer}</span>{" "}
            </p>
          )}

          {revealAnswer && (
            <Button
              className="mt-4 text-2xl border-white border cursor-pointer p-10"
              onClick={showAnswer}
            >
              Reveal Answer
            </Button>
          )}
          {nextQuestion && (
            <Button
              className="mt-4 text-2xl border-white border cursor-pointer p-10"
              onClick={showNext}
            >
              Next Question
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl">All questions are completed</h1>
          <Button
            className="mt-4 text-2xl border-white border cursor-pointer p-10"
            onClick={showResults}
          >
            Show Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default StartingQuiz;
