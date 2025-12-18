import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateStatus } from '../build/pages/Quiz.js';
import { buildSession } from '../build/utils/session.js';

const answerQuestion = (question, correct) => {
  if (question.type === 'mcq') {
    const targetIndex = question.options.findIndex((option) =>
      correct ? option === question.answer : option !== question.answer,
    );
    const selectedIndex = targetIndex === -1 ? 0 : targetIndex;
    const status = evaluateStatus({ ...question, selectedIndex });
    return { ...question, selectedIndex, status };
  }

  if (question.type === 'numeric') {
    const provided = correct
      ? question.answer.trim()
      : (Number(question.answer) + 1 || 1).toString();
    const status = evaluateStatus({ ...question, response: provided }, provided);
    return { ...question, response: provided, status };
  }

  const provided = correct ? question.answer.toUpperCase() : `${question.answer} extra`;
  const status = evaluateStatus({ ...question, response: provided }, provided);
  return { ...question, response: provided, status };
};

const attemptAdvance = (session) => {
  const question = session.questions[session.currentIndex];
  if (question.status !== 'correct') return session.currentIndex;
  return Math.min(session.questions.length - 1, session.currentIndex + 1);
};

describe('quiz UI progression', () => {
  it('wrong answer does not advance or increase progress', () => {
    const session = buildSession(3, 2, 10, 'WRONG-STEP');
    const updatedQuestion = answerQuestion(session.questions[0], false);
    const updatedSession = {
      ...session,
      questions: [updatedQuestion, ...session.questions.slice(1)],
    };

    const nextIndex = attemptAdvance(updatedSession);
    const correctCount = updatedSession.questions.filter((question) => question.status === 'correct').length;

    assert.equal(nextIndex, 0);
    assert.equal(correctCount, 0);
  });

  it('correct answer advances exactly one step', () => {
    const session = buildSession(3, 2, 10, 'RIGHT-STEP');
    const updatedQuestion = answerQuestion(session.questions[0], true);
    const updatedSession = {
      ...session,
      questions: [updatedQuestion, ...session.questions.slice(1)],
    };

    const nextIndex = attemptAdvance(updatedSession);
    const correctCount = updatedSession.questions.filter((question) => question.status === 'correct').length;

    assert.equal(nextIndex, 1);
    assert.equal(correctCount, 1);
  });
});
