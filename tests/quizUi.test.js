import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateProgressPercent, evaluateStatus } from '../build/pages/Quiz.js';
import { toChoiceLetter } from '../build/utils/explanation.js';
import { buildSession } from '../build/utils/session.js';

const answerQuestionAtIndex = (session, questionIndex, correct) => {
  const question = session.questions[questionIndex];
  const targetIndex = question.options.findIndex((option) =>
    correct ? option === question.answer : option !== question.answer,
  );
  const selectedIndex = targetIndex === -1 ? 0 : targetIndex;
  const selectedChoice = toChoiceLetter(selectedIndex);
  const isCorrect = question.options[selectedIndex] === question.answer;

  const updatedQuestions = session.questions.map((item, index) =>
    index === questionIndex ? { ...item, selectedChoice, isCorrect } : item,
  );

  const completedQuestions = new Set(session.completedQuestions);
  if (isCorrect) {
    completedQuestions.add(questionIndex);
  } else {
    completedQuestions.delete(questionIndex);
  }

  return { ...session, questions: updatedQuestions, completedQuestions, currentIndex: questionIndex };
};

const attemptAdvance = (session) => {
  if (!session.completedQuestions.has(session.currentIndex)) return session.currentIndex;
  return Math.min(session.questions.length - 1, session.currentIndex + 1);
};

describe('quiz UI progression', () => {
  it('wrong answer does not advance or increase progress', () => {
    const session = buildSession(3, 2, 10, 'WRONG-STEP');
    const updatedSession = answerQuestionAtIndex(session, 0, false);

    const nextIndex = attemptAdvance(updatedSession);
    const status = evaluateStatus(updatedSession.questions[0]);

    assert.equal(status, 'incorrect');
    assert.equal(nextIndex, 0);
    assert.equal(updatedSession.completedQuestions.size, 0);
  });

  it('correct answer advances exactly one step', () => {
    const session = buildSession(3, 2, 10, 'RIGHT-STEP');
    const updatedSession = answerQuestionAtIndex(session, 0, true);

    const nextIndex = attemptAdvance(updatedSession);

    assert.equal(nextIndex, 1);
    assert.equal(updatedSession.completedQuestions.size, 1);
  });

  it('allows retrying an incorrect answer before advancing', () => {
    const session = buildSession(4, 1, 12, 'RETRY-FLOW');
    const firstAttempt = answerQuestionAtIndex(session, 0, false);
    const retry = answerQuestionAtIndex(firstAttempt, 0, true);

    const nextIndex = attemptAdvance(retry);

    assert.equal(nextIndex, 1);
    assert.equal(retry.completedQuestions.size, 1);
  });

  it('progress only counts completed questions', () => {
    const session = buildSession(5, 3, 15, 'PROGRESS-CHECK');
    const firstCorrect = answerQuestionAtIndex(session, 0, true);
    const secondCorrect = answerQuestionAtIndex(firstCorrect, 1, true);
    const incorrect = answerQuestionAtIndex(secondCorrect, 2, false);

    const percent = calculateProgressPercent(incorrect.completedQuestions, incorrect.questions.length);

    assert.equal(incorrect.completedQuestions.size, 2);
    assert.equal(percent, Math.round((2 / incorrect.questions.length) * 100));
    assert.equal(attemptAdvance(incorrect), 2);
  });
});
