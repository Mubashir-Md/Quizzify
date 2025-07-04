import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token";
import { createQuiz, getMyQuizzes, saveQuiz } from "../controllers/quiz-controllers";

const router = Router();

router.post("/quiz", verifyToken, createQuiz);
router.post("/saveQuiz", verifyToken, saveQuiz);
router.get("/myQuizzes", verifyToken, getMyQuizzes);

export default router;
