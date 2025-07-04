export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

export interface QuizPayload {
  topic: string;
  questions: QuizQuestion[];
}
