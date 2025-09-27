export type QuestionType = "mcq" | "short";

export type Question = {
  type: QuestionType;
  prompt: string;
  options: { value: string }[];
  correctAnswer: string;
};

export type FormValues = {
  questions: Question[];
};
