export type QuestionType = 'mcq';

export type QuestionStatus = 'unanswered' | 'correct' | 'incorrect';

export type QuizQuestion = {
  id: number;
  prompt: string;
  type: QuestionType;
  answer: string;
  explanation: string;
  ccssCode: string;
  templateId: string;
  options: string[];
  selectedChoice: string | null;
  isCorrect: boolean | null;
};

export type QuizSession = {
  code: string;
  grade: number;
  point: number;
  numberLimit: number;
  allowedCcssCodes: string[];
  questions: QuizQuestion[];
  currentIndex: number;
  completedQuestions: Set<number>;
};
