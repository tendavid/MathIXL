import { generateQuestions } from './questionGenerator';
import { QuizSession } from '../types/quiz';

const SESSION_STORAGE_KEY = 'mathixl-quiz-session';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateCode = (length = 5) =>
  Array.from({ length }, () => characters[randomInt(0, characters.length - 1)]).join('');

export const buildSession = (
  grade: number,
  point: number,
  numberLimit: number,
  code = generateCode(5),
): QuizSession => {
  const questions = generateQuestions(
    grade,
    point,
    numberLimit,
    `${code}-${grade}-${point}-${numberLimit}`,
  );

  return {
    code,
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
