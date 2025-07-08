import express from "express";
import "dotenv/config";
import cors from "cors";
import { WebSocket, WebSocketServer } from 'ws';
import quizRoutes from './routes/quiz-routes'
import mongoose from "mongoose";
import { QuizModel } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", quizRoutes)

const wss = new WebSocketServer({port: 8080});

interface AnswerReceived{
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

const rooms: Record<string, QuizzifyRoom> = {}

wss.on("connection", (socket: WebSocket)=>{

    socket.on("message", async (message) =>{
        
        const parsedMessage = JSON.parse(message.toString());

        if(parsedMessage.type === "start"){
            console.log("Inside start")
            const roomId = parsedMessage.payload.roomId;
            const quizId = parsedMessage.payload.quizId;

            const quiz = await QuizModel.findById(quizId);

            if(!quiz){
                socket.send(JSON.stringify({type: "error", payload: {message: "Quiz not found..."}}))
                return;
            }

            rooms[roomId] = {
                admin: socket,
                quizQuestions: quiz.questions,
                participants: [],
                currentQuestion: null,
                currentIndex: 0,
                answersReceived: []
            }
            rooms[roomId].participants.push({nickname: "admin", socket, roomId, score: 0 })
            console.log(`Room ${roomId} initialized with quiz ${quizId}`);
        }


        if(parsedMessage.type === "join"){
            const roomId = parsedMessage.payload.roomId
            const nickname = parsedMessage.payload.nickname
            
            if(!rooms[roomId]){
                socket.send(JSON.stringify({
                    type: "error",
                    payload: {
                        message: "Room not initialized yet"
                    }
                }))
                return;
            }

            rooms[roomId].participants.push({nickname, socket, roomId, score: 0 })

            const participants = rooms[roomId].participants
            participants.forEach((p) => {
                p.socket.send(JSON.stringify({
                    type: "participants",
                    payload: {
                        users: participants.map(p => p.nickname)
                    }
                }))
            })

            
        }


        if(parsedMessage.type === "question"){
            const roomId = parsedMessage.payload.roomId;
            if(!roomId){
                socket.send(JSON.stringify({
                    type: "error",
                    payload: {
                        message: "Room not initiailized yet"
                    }
                }))
                return;
            }
            const room = rooms[roomId]
            if(!room){
                socket.send(JSON.stringify({
                    type: "error",
                    payload: { message: "Room doesn't exist" }
                    }));
                return;
            }
            console.log(room);
            const index = room.currentIndex
            const quizQuestion = room.quizQuestions[index]
            rooms[roomId].currentIndex += 1;

            const participants = rooms[roomId].participants
            participants.forEach((p) => {
                p.socket.send(JSON.stringify({
                    type: "question",
                    payload: {
                        question: quizQuestion.question,
                        choices: quizQuestion.choices,
                    }
                }))
            })

            room.admin.send(JSON.stringify({
                type: "question",
                payload: {
                    question: quizQuestion.question,
                    choices: quizQuestion.choices,
                }
            }))

        }

        if(parsedMessage.type === "answer"){
            const {roomId, nickname, answer: yourAnswer} = parsedMessage.payload.roomId;

            const thisRoom = rooms[roomId]

            let correct: boolean = false;

            
            const index = thisRoom.currentIndex
            const correctAnswer = thisRoom.quizQuestions[index].answer
            
            if(yourAnswer === correctAnswer){
                correct = true;
            }
            
            thisRoom.answersReceived.push({nickname, answer: yourAnswer, isRight: correct})

            

        }

        if(parsedMessage.type === "reveal"){
            const roomId = parsedMessage.payload.roomId;
            if(!roomId) return;

            const room = rooms[roomId]
            const index = room.currentIndex
            const correctAnswer = room.quizQuestions[index].answer
            const participants = room.participants
            participants.forEach((p) => {
                p.socket.send(JSON.stringify({
                    type: "answer",
                    payload: {
                        correctAnswer
                    }
                }))
            })

            room.admin.send(JSON.stringify({
                type: "answer",
                    payload: {
                        correctAnswer
                    }
            }))
        }

    })
})

const port = 3000;

const startServer = async ()=>{
    try {

        await mongoose.connect(process.env.MONGO_DB_URI!)
        console.log("✅ MongoDB connected");

        app.listen(port, () => {
          console.log(`Quizzy form listening on port ${port}`);
        });
        
    } catch (error) {
        
    }
}

startServer()

