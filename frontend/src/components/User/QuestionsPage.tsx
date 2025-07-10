import { useSocket } from "@/contexts/SocketProvider";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const QuestionsPage = () => {
  const { socket, latestMessage, nickname } = useSocket();
  const [question, setQuestion] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [_, setIndex] = useState<number>();
  const [showSubmit, setShowSubmit] = useState<boolean>(true);

  const [selected, setSelected] = useState("");

  const [done, setDone] = useState<boolean>(false);

  const roomId = localStorage.getItem("roomId") || "";

  const nav = useNavigate()

  const handleSubmit = () => {
    console.log(selected);

    if (!selected) return;
    console.log(socket);
    setShowSubmit(false);
    socket?.send(
      JSON.stringify({
        type: "answer",
        payload: {
          answer: selected,
          roomId,
          nickname,
          question,
        },
      })
    );

    console.log("Selected:", selected);
    // send to backend if needed
  };

  useEffect(() => {
    if (!latestMessage) return;
    const q = JSON.parse(latestMessage.data);
    if (q.type === "question") {
      setQuestion(q.payload.question);
      setChoices(q.payload.choices);
      setIndex(q.payload.index);
      setShowSubmit(true);
    }
    if (q.type === "answer") {
      setCorrectAnswer(q.payload.correctAnswer);
      setShowSubmit(false);
    }

    if (q.type === "done") {
      setDone(true);
    }

    if(q.type === "results"){
      nav("/results")
    }
  }, [latestMessage]);

  console.log(latestMessage);

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-screen p-4 space-y-10">
      {!done ?
        <>
          <p className="text-4xl text-center max-w-4xl">{question}</p>

          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
          >
            {choices.map((choice, idx) => (
              <Label
                key={idx}
                htmlFor={`choice-${idx}`}
                className={clsx(
                  "flex items-center justify-center text-xl font-semibold",
                  "p-8 rounded-2xl cursor-pointer transition-all duration-200",
                  "bg-white text-black border-4 border-transparent",
                  selected === choice && "scale-105 shadow-lg bg-yellow-200",
                  choice === correctAnswer &&
                    "bg-green-400 text-black pointer-events-none"
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

          {showSubmit && (
            <Button
              className="mt-4 text-2xl border-white border cursor-pointer p-10 hover:bg-green-900"
              onClick={handleSubmit}
              disabled={!selected}
              type="button"
            >
              Submit Answer
            </Button>
          )}
        </>
        : 
        <div className="flex flex-col items-center justify-between">
          <h1>All questions are completed</h1>
          <p>Wait for results...</p>
          <p>We know you nailed it</p>
        </div>
      }
    </div>
  );
};

export default QuestionsPage;
