import { describeAllowedCcssCodes, generateQuestions } from './questionGenerator';
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
  const questionSet = generateQuestions(
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
    allowedCcssCodes: questionSet.allowedCcssCodes,
    questions: questionSet.questions,
    currentIndex: 0,
  };
};

export const loadSession = (): QuizSession | null => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as QuizSession;
    return {
      ...parsed,
      allowedCcssCodes:
        parsed.allowedCcssCodes ?? describeAllowedCcssCodes(parsed.grade, parsed.point),
      questions: parsed.questions.map((question, index) => ({
        ...question,
        templateId: question.templateId ?? 'unknown-template',
        selectedIndex: question.selectedIndex ?? null,
        response: question.response ?? null,
        status: question.status ?? 'unanswered',
        id: question.id ?? index + 1,
      })),
    };
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
