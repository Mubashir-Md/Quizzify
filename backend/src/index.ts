import express from "express";
import "dotenv/config";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";
import quizRoutes from "./routes/quiz-routes";
import mongoose from "mongoose";
import { QuizModel } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", quizRoutes);

const wss = new WebSocketServer({ port: 8080 });

interface AnswerReceived {
  nickname: string;
  answer: string;
  isRight: boolean;
}

interface Participant {
  nickname: string;
  socket: WebSocket;
  roomId: string;
  score: number;
}
interface Question {
  question: string;
  choices: string[];
  answer: string;
}

interface QuizzifyRoom {
  admin: WebSocket;
  quizQuestions: Question[];
  participants: Participant[];
  currentQuestion: Question | null;
  currentIndex: number;
  answersReceived: AnswerReceived[];
}

const rooms: Record<string, QuizzifyRoom> = {};

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "start") {
      console.log("Inside start");
      const roomId = parsedMessage.payload.roomId;
      const quizId = parsedMessage.payload.quizId;

      const quiz = await QuizModel.findById(quizId);

      if (!quiz) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: { message: "Quiz not found..." },
          })
        );
        return;
      }

      rooms[roomId] = {
        admin: socket,
        quizQuestions: quiz.questions,
        participants: [],
        currentQuestion: null,
        currentIndex: 0,
        answersReceived: [],
      };
      rooms[roomId].participants.push({
        nickname: "admin",
        socket,
        roomId,
        score: 0,
      });
      console.log(`Room ${roomId} initialized with quiz ${quizId}`);
    }

    if (parsedMessage.type === "join") {
      const roomId = parsedMessage.payload.roomId;
      const nickname = parsedMessage.payload.nickname;

      if (!rooms[roomId]) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: {
              message: "Room not initialized yet",
            },
          })
        );
        return;
      }

      rooms[roomId].participants.push({ nickname, socket, roomId, score: 0 });

      const participants = rooms[roomId].participants;
      participants.forEach((p) => {
        p.socket.send(
          JSON.stringify({
            type: "participants",
            payload: {
              users: participants.map((p) => p.nickname),
            },
          })
        );
      });
    }

    if (parsedMessage.type === "question") {
      const { roomId, currentIndex } = parsedMessage.payload;
      const room = rooms[roomId];

      if (currentIndex === room.quizQuestions.length - 1) {
        socket.send(
          JSON.stringify({
            type: "done",
            payload: {
              message: "Quiz quiestions have come to an end",
            },
          })
        );
        return;
      }

      if (!roomId) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: {
              message: "Room not initiailized yet",
            },
          })
        );
        return;
      }
      if (!room) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: { message: "Room doesn't exist" },
          })
        );
        return;
      }
      console.log(room);

      room.currentIndex = currentIndex + 1;

      const index = room.currentIndex;

      const questionObj = room.quizQuestions[index];

      room.currentQuestion = questionObj;
      room.answersReceived = [];

      const participants = rooms[roomId].participants;
      participants.forEach((p) => {
        p.socket.send(
          JSON.stringify({
            type: "question",
            payload: {
              question: questionObj.question,
              choices: questionObj.choices,
              index,
            },
          })
        );
      });

      room.admin.send(
        JSON.stringify({
          type: "question",
          payload: {
            question: questionObj.question,
            choices: questionObj.choices,
            index,
          },
        })
      );
    }

    if (parsedMessage.type === "answer") {
      const {
        roomId,
        nickname,
        answer: yourAnswer,
        question,
      } = parsedMessage.payload;

      const thisRoom = rooms[roomId];

      let correct = false;

      const correctAnswer = thisRoom.quizQuestions.find(
        (q) => q.question === question
      )?.answer;

      thisRoom.answersReceived.push({
        nickname,
        answer: yourAnswer,
        isRight: correct,
      });

      const participant = thisRoom.participants.find(
        (p) => p.nickname === nickname
      );

      if (participant) {
        if (yourAnswer === correctAnswer) {
          correct = true;
          participant.score += 1;
        }
      }
    }

    if (parsedMessage.type === "reveal") {
      const { roomId, question } = parsedMessage.payload;
      if (!roomId) return;

      const room = rooms[roomId];
      const correctAnswer = room.quizQuestions.find(
        (q) => q.question === question
      )?.answer;
      const participants = room.participants;
      participants.forEach((p) => {
        p.socket.send(
          JSON.stringify({
            type: "answer",
            payload: {
              correctAnswer,
            },
          })
        );
      });

      room.admin.send(
        JSON.stringify({
          type: "answer",
          payload: {
            correctAnswer,
          },
        })
      );
    }

    if(parsedMessage.type === "results"){
        const roomId = parsedMessage.payload.roomId

        if (!roomId) return;

        const room = rooms[roomId]
        const participants = room.participants;

        const totalScore = room.quizQuestions.length;
        

        participants.forEach((p) => {
            const score = p.score
            p.socket.send(
            JSON.stringify({
                type: "results",
                payload: {
                    score,
                    totalScore
                },
            })
            );
        });

        room.admin.send(
            JSON.stringify({
            type: "results",
            payload: {
                participants,
                totalScore
            },
            })
        );


    }
  });
});

const port = 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI!);
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`Quizzy form listening on port ${port}`);
    });
  } catch (error) {}
};

startServer();
