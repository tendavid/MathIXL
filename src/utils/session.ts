export type QuizQuestion = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
};

export type QuizSession = {
  code: string;
  grade: number;
  point: number;
  numberLimit: number;
  questions: QuizQuestion[];
  currentIndex: number;
};

const SESSION_STORAGE_KEY = 'mathixl-quiz-session';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateCode = (length = 5) =>
  Array.from({ length }, () => characters[randomInt(0, characters.length - 1)]).join('');

const createOptions = (answer: number) => {
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const delta = randomInt(-3, 3) || 1;
    const distractor = Math.max(0, answer + delta * randomInt(1, 3));
    options.add(distractor === answer ? distractor + 1 : distractor);
  }
  return Array.from(options).sort(() => Math.random() - 0.5).map((value) => value.toString());
};

const generateQuestion = (index: number, grade: number, point: number, numberLimit: number): QuizQuestion => {
  const span = Math.max(5, numberLimit);
  const a = randomInt(1, span);
  const b = randomInt(1, Math.max(3, Math.round(span * (point / 5))));
  const useSubtraction = grade > 5 && index % 3 === 0;
  const prompt = useSubtraction
    ? `Question ${index + 1}: What is ${a + b} - ${b}?`
    : `Question ${index + 1}: What is ${a} + ${b}?`;
  const answer = useSubtraction ? a : a + b;
  const options = createOptions(answer);
  const correctIndex = options.findIndex((opt) => Number(opt) === answer);
  return { id: index + 1, prompt, options, correctIndex, selectedIndex: null };
};

export const buildSession = (
  grade: number,
  point: number,
  numberLimit: number,
): QuizSession => {
  const questions = Array.from({ length: 15 }, (_, index) =>
    generateQuestion(index, grade, point, numberLimit),
  );

  return {
    code: generateCode(5),
    grade,
    point,
    numberLimit,
    questions,
    currentIndex: 0,
  };
};

export const loadSession = (): QuizSession | null => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as QuizSession;
  } catch (error) {
    console.error('Failed to parse saved session', error);
    return null;
  }
};

export const saveSession = (session: QuizSession) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};
