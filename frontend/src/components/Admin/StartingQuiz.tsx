import { useSocket } from "@/contexts/SocketProvider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import clsx from "clsx";
import { Button } from "../ui/button";

const StartingQuiz = () => {
  const { quizId, roomId } = useParams();
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

  const showAnswer = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "reveal",
        payload: {
          roomId,
          quizId,
        },
      })
    );
  };

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.send(
  //     JSON.stringify({
  //       type: "question",
  //       payload: {
  //         roomId,
  //       },
  //     })
  //   );
  // }, [socket]);

  useEffect(() => {
    if (!latestMessage) return;

    const message = JSON.parse(latestMessage.data);
    setQuestion(message.payload.question);
    setChoices(message.payload.choices);

    console.log(latestMessage);
  }, [latestMessage]);

  console.log(latestMessage);
  

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-screen p-4 space-y-10">
      <p className="text-4xl text-center max-w-4xl">{question}</p>

      <RadioGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {choices.map((choice, idx) => (
          <Label
            key={idx}
            htmlFor={`choice-${idx}`}
            className={clsx(
              "flex items-center justify-center text-xl font-semibold",
              "p-8 rounded-2xl cursor-pointer transition-all duration-200",
              "bg-white text-black border-4 border-transparent",
              "hover:bg-yellow-200"
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
        className="mt-4 text-2xl border-white border cursor-pointer p-10"
        onClick={showAnswer}
      >
        Reveal Answer
      </Button>
    </div>
  );
};

export default StartingQuiz;
