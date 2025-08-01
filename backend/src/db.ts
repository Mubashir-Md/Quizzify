import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const QuizQuestionSchema = new Schema({
  question: { type: String, required: true },
  choices: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const QuizSchema = new Schema(
  {
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: { type: [QuizQuestionSchema], required: true },
    ownerId: { type: String, required: true }, // Supabase UID or anon ID
    roomId: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const QuizModel = model("Quiz", QuizSchema)
