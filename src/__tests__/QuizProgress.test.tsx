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

describe('Quiz progression and completion gating', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('blocks progress after an incorrect answer and allows it after a correct one', async () => {
    const { session, user } = renderQuizWithSeed('PROGRESS-LOCK');
    const firstQuestion = session.questions[0];

    await screen.findByText(firstQuestion.prompt);
    expect(screen.getByTestId('completed-label')).toHaveTextContent('Completed: 0/15');

    const wrongIndex = firstQuestion.options.findIndex((option) => option !== firstQuestion.answer);
    const wrongButton = screen.getByTestId(`option-${wrongIndex}`);
    await user.click(wrongButton);

    expect(screen.getByTestId('progress-text')).toHaveTextContent(`0/${session.questions.length}`);
    expect(screen.getByTestId('completed-label')).toHaveTextContent('Completed: 0/15');
    expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();

    await user.click(screen.getByText('Debug'));
    expect(screen.getByTestId('debug-progress-displayed')).toHaveTextContent('progressDisplayed: 0');
    expect(screen.getByTestId('debug-completed-count')).toHaveTextContent(
      'completedCorrectCount: 0',
    );
    expect(screen.getByTestId('debug-completed-set')).toHaveTextContent('completedCorrectSet: None');

    const correctIndex = firstQuestion.options.findIndex((option) => option === firstQuestion.answer);
    const correctButton = screen.getByTestId(`option-${correctIndex}`);
    await user.click(correctButton);

    expect(screen.getByTestId('progress-text')).toHaveTextContent(`1/${session.questions.length}`);
    expect(screen.getByTestId('completed-label')).toHaveTextContent('Completed: 1/15');
    expect(screen.getByTestId('debug-progress-displayed')).toHaveTextContent('progressDisplayed: 1');
    expect(screen.getByTestId('debug-completed-count')).toHaveTextContent(
      'completedCorrectCount: 1',
    );
    expect(screen.getByRole('button', { name: /Next/i })).toBeEnabled();
  });
});
