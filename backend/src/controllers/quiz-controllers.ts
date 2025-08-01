import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { QuizModel } from "../db";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const createQuiz = async (req: Request, res: Response) => {
  const { topic, questions, choices, difficulty, ownerId } = req.body;

  const prompt = `
      You're an expert at making quizzes of given topics, generate a ${difficulty} level quiz on the topic "${topic}".
      - Number of questions: ${questions}
      - Number of choices per question: ${choices}
      - Format the response strictly as a single JSON object in this structure:
      {{
          topic: ${topic},
          difficulty: ${difficulty},
          questions: 
              [
                  {{
                      "question": "Your question text here",
                      "choices": ["Option A", "Option B", "Option C", "Option D"],
                      "answer": "Correct option"
                  }}
              ],
      }}
      Return only the JSON object, don't put it in a Markdown code block as it will give backticks and a as well in the response, make sure you give only JSON.
      `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    let text = response.text?.trim();
    text = text?.replace(/```json|```/g, "").trim();

    const quizObject = JSON.parse(text || "");

    if (
      typeof quizObject !== "object" ||
      !quizObject.topic ||
      !Array.isArray(quizObject.questions)
    ) {
      throw new Error("Invalid quiz structure returned");
    }

    res.send({ ...quizObject, ownerId });
  } catch (error) {
    console.log(error);
  }
};

export const saveQuiz = async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;
  const { topic, difficulty, questions } = req.body;

  try {
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    const quiz = new QuizModel({ topic, difficulty, questions, ownerId, roomId });
    await quiz.save();
    res.json({ roomId, quizId: quiz._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save quiz" });
  }
};

export const getMyQuizzes = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const ownerId = user.id;
  try {
    const quizzes = await QuizModel.find({ ownerId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};
