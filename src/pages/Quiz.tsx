import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, loadSession, saveSession } from '../utils/session';
import { QuestionStatus, QuizQuestion, QuizSession } from '../types/quiz';
import { createFriendlyExplanation, toChoiceLetter } from '../utils/explanation';

export const evaluateStatus = (question: QuizQuestion): QuestionStatus => {
  if (question.isCorrect === null) return 'unanswered';
  return question.isCorrect ? 'correct' : 'incorrect';
};

export const calculateProgressPercent = (completedQuestions: Set<number>, totalQuestions: number) =>
  Math.round((completedQuestions.size / Math.max(1, totalQuestions)) * 100);

const Quiz = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    const storedSession = loadSession();
    if (!storedSession) {
      navigate('/');
      return;
    }
    setSession(storedSession);
  }, [navigate]);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return session.questions[session.currentIndex] ?? null;
  }, [session]);

  const completedCount = useMemo(() => {
    if (!session) return 0;
    return session.completedQuestions.size;
  }, [session]);

  const handleAnswer = (optionIndex: number) => {
    if (!session || !currentQuestion) return;
    if (evaluateStatus(currentQuestion) === 'correct') return;

    const selectedChoice = toChoiceLetter(optionIndex);
    const selectedOption = currentQuestion.options[optionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    const updatedQuestions = session.questions.map((question) =>
      question.id === currentQuestion.id
        ? ({ ...question, selectedChoice, isCorrect } as QuizQuestion)
        : question,
    );

    const completedQuestions = new Set(session.completedQuestions);
    if (isCorrect) {
      completedQuestions.add(session.currentIndex);
    }

    const updatedSession = { ...session, questions: updatedQuestions, completedQuestions };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleNext = () => {
    if (!session || !currentQuestion) return;
    if (!session.completedQuestions.has(session.currentIndex)) return;
    const nextIndex = Math.min(session.questions.length - 1, session.currentIndex + 1);
    if (nextIndex === session.currentIndex) return;
    const updatedSession = { ...session, currentIndex: nextIndex };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleReset = () => {
    clearSession();
    setSession(null);
    navigate('/');
  };

  if (!session || !currentQuestion) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading session...</p>
        </section>
      </main>
    );
  }

  const progressPercent = calculateProgressPercent(session.completedQuestions, session.questions.length);
  const atLastQuestion = session.currentIndex === session.questions.length - 1;
  const nextDisabled = !session.completedQuestions.has(session.currentIndex) || atLastQuestion;
  const allowedCodes = session.allowedCcssCodes ?? [];
  const typeLabelMap: Record<QuizQuestion['type'], string> = {
    mcq: 'Multiple choice',
  };
  const statusLabels: Record<QuestionStatus, string> = {
    correct: 'Correct',
    incorrect: 'Try again',
    unanswered: 'Pending',
  };
  const currentStatus = evaluateStatus(currentQuestion);
  const friendlyExplanation = createFriendlyExplanation(
    session.grade,
    currentQuestion.explanationSteps,
    currentQuestion.answer,
  );
  const explanationSteps = currentQuestion.explanationSteps;
  const showFeedback = currentQuestion.selectedChoice !== null;

  return (
    <main className="page">
      <section className="card">
        <header className="quiz-header">
          <div>
            <p className="label">Session Code</p>
            <p className="code">{session.code}</p>
          </div>
          <div className="meta">
            <span>Grade {session.grade}</span>
            <span>Point {session.point}</span>
            <span>Up to {session.numberLimit}</span>
          </div>

          <details className="ccss-allowed">
            <summary>Allowed CCSS codes for this selection</summary>
            <p>{allowedCodes.length ? allowedCodes.join(', ') : 'No allowed CCSS codes available.'}</p>
          </details>
        </header>

        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-text">
            <span data-testid="progress-text">
              Progress {completedCount}/{session.questions.length}
            </span>
            <span>
              Current question {session.currentIndex + 1}/{session.questions.length}
            </span>
          </div>
        </div>

        <article className="question">
          <div className="question-header">
            <p className="prompt">{currentQuestion.prompt}</p>
            <div className="question-meta">
              {currentStatus !== 'unanswered' && (
                <span className={`status-pill ${currentStatus}`}>
                  {statusLabels[currentStatus]}
                </span>
              )}
              <span className="type-pill">{typeLabelMap[currentQuestion.type]}</span>
            </div>
          </div>

          <div className="options">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = toChoiceLetter(index);
              const isSelected = currentQuestion.selectedChoice === optionLetter;
              const isCorrectChoice = option === currentQuestion.answer;
              const showCorrectHighlight = currentStatus === 'incorrect' && isCorrectChoice;
              const isWrongSelection = currentStatus === 'incorrect' && isSelected && !isCorrectChoice;
              const classes = [
                'option',
                isSelected ? 'selected' : '',
                showCorrectHighlight || (currentStatus === 'correct' && isSelected)
                  ? 'correct'
                  : '',
                isWrongSelection ? 'incorrect' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  className={classes}
                  data-testid={`option-${index}`}
                  onClick={() => handleAnswer(index)}
                >
                  <span className="option-letter">{optionLetter}.</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`feedback ${currentStatus === 'correct' ? 'success' : 'error'}`}
              role="status"
            >
              <p>{currentStatus === 'correct' ? 'Correct! You can move to the next question.' : 'Incorrect.'}</p>
              {currentStatus === 'incorrect' && <p>Correct answer: {currentQuestion.answer}</p>}
              <div className="explanation">
                <p>Explanation:</p>
                <ul className="explanation-steps">
                  {explanationSteps.length ? (
                    explanationSteps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)
                  ) : (
                    <li>No steps available.</li>
                  )}
                </ul>
                {friendlyExplanation && (
                  <p className="explanation-summary">{friendlyExplanation}</p>
                )}
              </div>
            </div>
          )}

          <p className="ccss">CCSS: {currentQuestion.ccssCode}</p>
          <p className="ccss">Template: {currentQuestion.templateId ?? 'unknown'}</p>
        </article>

        <details className="debug-panel" data-testid="debug-panel">
          <summary>Debug</summary>
          <div className="debug-content">
            <p data-testid="debug-current-question">
              Current question ID {currentQuestion.id} (index {session.currentIndex})
            </p>
            <p data-testid="debug-progress-value">
              Progress value: {completedCount}/{session.questions.length} ({progressPercent}%)
            </p>
            <div>
              <p data-testid="debug-completed-count">Completed questions ({completedCount}):</p>
              <ul data-testid="debug-completed-list">
                {completedCount ? (
                  Array.from(session.completedQuestions)
                    .sort((a, b) => a - b)
                    .map((value) => (
                      <li key={value}>Index {value + 1}</li>
                    ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </div>
        </details>

        <footer className="actions">
          <button type="button" className="secondary" onClick={handleReset}>
            End Session
          </button>
          <button type="button" className="primary" onClick={handleNext} disabled={nextDisabled}>
            Next
          </button>
        </footer>

        {atLastQuestion && session.completedQuestions.has(session.currentIndex) && (
          <p className="notice">You have reached the end of this quiz session.</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
