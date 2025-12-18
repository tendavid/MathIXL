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
  selectedIndex: number | null;
  response: string | null;
  status: QuestionStatus;
};

export type QuizSession = {
  code: string;
  grade: number;
  point: number;
  numberLimit: number;
  allowedCcssCodes: string[];
  questions: QuizQuestion[];
  currentIndex: number;
};
