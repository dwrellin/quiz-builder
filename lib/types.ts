// Builder Types
export type QuestionType = "mcq" | "short";

export type QuizFormValues = {
  title: string;
  description: string;
};

export type Question = {
  type: QuestionType;
  prompt: string;
  options: { value: string }[];
  correctAnswer: string;
};

export type QuestionFormValues = {
  questions: Question[];
};

// Custom type to replicate DB's response
export type QuestionFromDB = {
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
};

// Answer Quiz Types
export type QuizAnswer = {
  questionId: string;
  value: string;
};

// Quiz Types
export type Quiz = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isPublished: boolean;
};

// Result Type
export type ResultDetails = {
  questionId: number;
  expected: string;
  correct: boolean;
};

export type Result = {
  score: number;
  details: ResultDetails[];
};

export type ResultDetailsWithCorrectAnswer = ResultDetails & {
  correctAnswer: string;
};

// export type FetchQuizzesResponse = Awaited<ReturnType<typeof fetchQuizzes>>;
