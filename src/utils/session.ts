import { describeAllowedCcssCodes, generateQuestions } from './questionGenerator';
import { createFriendlyExplanation, normalizeExplanationSteps } from './explanation';
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
    completedSet: new Set<number>(),
  };
};

export const loadSession = (): QuizSession | null => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as QuizSession;
    const legacyCompleted = Array.isArray((parsed as unknown as { completedQuestions?: number[] }).completedQuestions)
      ? new Set<number>((parsed as unknown as { completedQuestions: number[] }).completedQuestions)
      : null;
    const completed = Array.isArray((parsed as unknown as { completedSet?: number[] }).completedSet)
      ? new Set<number>((parsed as unknown as { completedSet: number[] }).completedSet)
      : legacyCompleted ?? new Set<number>();
    return {
      ...parsed,
      allowedCcssCodes:
        parsed.allowedCcssCodes ?? describeAllowedCcssCodes(parsed.grade, parsed.point),
      questions: parsed.questions.map((question, index) => {
        const legacyStatus = (question as unknown as { status?: 'correct' | 'incorrect' | 'unanswered' }).status;
        const fallbackIsCorrect =
          legacyStatus === 'correct' ? true : legacyStatus === 'incorrect' ? false : null;
        const legacySelectedIndex = (question as unknown as { selectedIndex?: number | null }).selectedIndex;
        const legacyChoice =
          typeof legacySelectedIndex === 'number' ? String.fromCharCode(65 + legacySelectedIndex) : null;
        const explanationSteps = normalizeExplanationSteps(
          (question as unknown as { explanationSteps?: string[] }).explanationSteps,
          question.explanation,
        );
        const explanation = createFriendlyExplanation(parsed.grade, explanationSteps, question.answer);

        return {
          ...question,
          templateId: question.templateId ?? 'unknown-template',
          type: 'mcq',
          selectedChoice: question.selectedChoice ?? legacyChoice ?? null,
          isCorrect: question.isCorrect ?? fallbackIsCorrect ?? null,
          id: question.id ?? index + 1,
          options: question.options ?? [],
          explanationSteps,
          explanation,
        };
      }),
      completedSet: completed,
    };
  } catch (error) {
    console.error('Failed to parse saved session', error);
    return null;
  }
};

export const saveSession = (session: QuizSession) => {
  const serialized = {
    ...session,
    completedSet: Array.from(session.completedSet),
    completedQuestions: Array.from(session.completedSet),
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serialized));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};
