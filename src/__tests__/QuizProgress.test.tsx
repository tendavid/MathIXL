import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../pages/Quiz';
import { buildSession, saveSession } from '../utils/session';

const renderQuizWithSeed = (seed: string) => {
  const session = buildSession(3, 2, 10, seed);
  saveSession(session);
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/quiz']}>
      <Quiz />
    </MemoryRouter>,
  );

  return { session, user };
};

describe('Quiz scoring and progress updates', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does not increase correctCount after a wrong answer', async () => {
    const { session, user } = renderQuizWithSeed('WRONG-ANSWER');
    const firstQuestion = session.questions[0];

    await screen.findByText(firstQuestion.prompt);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('Correct: 0/15');

    const wrongIndex = firstQuestion.options.findIndex((option) => option !== firstQuestion.answer);
    await user.click(screen.getByTestId(`option-${wrongIndex}`));

    expect(screen.getByTestId('progress-text')).toHaveTextContent('Correct: 0/15');
  });

  it('locks choices after a wrong answer but keeps Next enabled', async () => {
    const { session, user } = renderQuizWithSeed('LOCK-CHOICES');
    const firstQuestion = session.questions[0];

    await screen.findByText(firstQuestion.prompt);
    const wrongIndex = firstQuestion.options.findIndex((option) => option !== firstQuestion.answer);
    const wrongButton = screen.getByTestId(`option-${wrongIndex}`);
    await user.click(wrongButton);

    expect(wrongButton).toBeDisabled();
    expect(screen.getByTestId('option-0')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Next/i })).toBeEnabled();
  });

  it('increases correctCount after a correct answer', async () => {
    const { session, user } = renderQuizWithSeed('CORRECT-ANSWER');
    const firstQuestion = session.questions[0];

    await screen.findByText(firstQuestion.prompt);
    const correctIndex = firstQuestion.options.findIndex(
      (option) => option === firstQuestion.answer,
    );
    await user.click(screen.getByTestId(`option-${correctIndex}`));

    expect(screen.getByTestId('progress-text')).toHaveTextContent('Correct: 1/15');
  });

  it('sets the progress bar based on correctCount only', async () => {
    const { session, user } = renderQuizWithSeed('PROGRESS-BAR');
    const firstQuestion = session.questions[0];

    await screen.findByText(firstQuestion.prompt);
    const wrongIndex = firstQuestion.options.findIndex((option) => option !== firstQuestion.answer);
    await user.click(screen.getByTestId(`option-${wrongIndex}`));

    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '0%' });

    await user.click(screen.getByRole('button', { name: /Next/i }));
    const secondQuestion = session.questions[1];
    await screen.findByText(secondQuestion.prompt);
    const correctIndex = secondQuestion.options.findIndex(
      (option) => option === secondQuestion.answer,
    );
    await user.click(screen.getByTestId(`option-${correctIndex}`));

    const expectedPercent = Math.round((1 / session.questions.length) * 100);
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: `${expectedPercent}%` });
  });
});
