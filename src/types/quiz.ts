export type QuestionType = 'mcq' | 'numeric' | 'text';

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
