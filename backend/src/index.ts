import express from "express";
import "dotenv/config";
import cors from "cors";
import { WebSocket, WebSocketServer } from 'ws';
import quizRoutes from './routes/quiz-routes'
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", quizRoutes)

const wss = new WebSocketServer({port: 8080});

wss.on("connection", (socket: WebSocket)=>{

    socket.on("message", (message) =>{
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type === 'start'){
            
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

