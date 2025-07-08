import { useSocket } from "@/contexts/SocketProvider";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import clsx from "clsx";

const QuestionsPage = () => {
  const { socket, latestMessage } = useSocket();
  const [question, setQuestion] = useState<string>(
    "What is Express.js primarily used for?"
  );
  const [choices, setChoices] = useState<string[]>([
    "Creating static websites",
    "Building server-side web applications",
    "Designing user interfaces",
    "Managing databases",
  ]);

  const [selected, setSelected] = useState("");

  const nickname = localStorage.getItem("nickname") || ''
  const roomId = localStorage.getItem("roomId") || ''

  const handleSubmit = () => {
    if (!selected) return;

    socket?.send(JSON.stringify({
      type: "answer",
      payload: {
        answer: selected,
        roomId,
        nickname
      }
    }))

    console.log("Selected:", selected);
    // send to backend if needed
  };

  useEffect(() => {
    if (!latestMessage) return;
    const q = JSON.parse(latestMessage.data);
    if (q.type === "question") {
      setQuestion(q.payload.question);
      setChoices(q.payload.choices);
    }
  }, [latestMessage]);

  console.log(latestMessage);
  

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-screen p-4 space-y-10">
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
              selected === choice && "scale-105 shadow-lg bg-yellow-200"
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

      <Button
        className="mt-4 text-2xl border-white border cursor-pointer p-10 hover:bg-green-900"
        onClick={handleSubmit}
        disabled={!selected}
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default QuestionsPage;
