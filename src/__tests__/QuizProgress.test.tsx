import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../pages/Quiz';
import { buildSession, saveSession } from '../utils/session';

const renderQuizWithSeed = (seed: string, options?: { advanceTimers?: boolean }) => {
  const session = buildSession(3, 2, 10, seed);
  saveSession(session);
  const user = userEvent.setup(
    options?.advanceTimers ? { advanceTimers: vi.advanceTimersByTime } : undefined,
  );

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

  it('renders the first question after starting the quiz', async () => {
    const { session } = renderQuizWithSeed('START-QUIZ');
    const firstQuestion = session.questions[0];

    expect(await screen.findByText(firstQuestion.prompt)).toBeInTheDocument();
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

    const expectedPercent = Math.round((1 / session.goalCorrect) * 100);
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: `${expectedPercent}%` });
  });

  it('does not end the session after 15 attempts without 15 correct', async () => {
    const { session, user } = renderQuizWithSeed('ATTEMPT-COUNT');

    for (let index = 0; index < 15; index += 1) {
      const question = session.questions[index];
      await screen.findByText(question.prompt);
      const wrongIndex = question.options.findIndex((option) => option !== question.answer);
      await user.click(screen.getByTestId(`option-${wrongIndex}`));
      if (index < 14) {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      }
    }

    await user.click(screen.getByRole('button', { name: /Next/i }));

    expect(screen.getByTestId('progress-text')).toHaveTextContent('Correct: 0/15');
    expect(screen.queryByText(/You reached the goal of 15 correct answers/i)).not.toBeInTheDocument();
  });

  it('ends the session when correctCount reaches 15', async () => {
    const { session, user } = renderQuizWithSeed('COMPLETE-SESSION');

    for (let index = 0; index < 15; index += 1) {
      const question = session.questions[index];
      await screen.findByText(question.prompt);
      const correctIndex = question.options.findIndex((option) => option === question.answer);
      await user.click(screen.getByTestId(`option-${correctIndex}`));
      if (index < 14) {
        await user.click(screen.getByRole('button', { name: /Next/i }));
      }
    }

    expect(await screen.findByText('Correct: 15/15')).toBeInTheDocument();
  });

  it('shows duration and session code on completion', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    const { session, user } = renderQuizWithSeed('SHOW-DURATION', { advanceTimers: true });

    for (let index = 0; index < 14; index += 1) {
      const question = session.questions[index];
      await screen.findByText(question.prompt);
      const correctIndex = question.options.findIndex((option) => option === question.answer);
      await user.click(screen.getByTestId(`option-${correctIndex}`));
      await user.click(screen.getByRole('button', { name: /Next/i }));
    }

    vi.setSystemTime(new Date('2024-01-01T00:01:05Z'));
    const finalQuestion = session.questions[14];
    await screen.findByText(finalQuestion.prompt);
    const finalCorrectIndex = finalQuestion.options.findIndex(
      (option) => option === finalQuestion.answer,
    );
    await user.click(screen.getByTestId(`option-${finalCorrectIndex}`));

    expect(await screen.findByText(`Session Code: ${session.code}`)).toBeInTheDocument();
    expect(screen.getByText('Time: 01:05')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
