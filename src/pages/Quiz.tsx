import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, loadSession, saveSession } from '../utils/session';
import { QuestionStatus, QuizQuestion, QuizSession } from '../types/quiz';
import { createFriendlyExplanation, toChoiceLetter } from '../utils/explanation';

export const evaluateStatus = (question: QuizQuestion): QuestionStatus => {
  if (question.isCorrect === null) return 'unanswered';
  return question.isCorrect ? 'correct' : 'incorrect';
};

export const calculateProgressPercent = (completedSet: Set<number>, totalQuestions: number) =>
  Math.round((completedSet.size / Math.max(1, totalQuestions)) * 100);

const Quiz = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const previousProgressRef = useRef(0);

  useEffect(() => {
    const storedSession = loadSession();
    if (!storedSession) {
      navigate('/');
      return;
    }
    setSession(storedSession);
  }, [navigate]);

  if (!session) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading quiz…</p>
        </section>
      </main>
    );
  }

  const questions = session.questions;
  const currentIndex = session.currentIndex;
  const completedSet = session.completedSet;
  const allowedCodes = session.allowedCcssCodes;
  const isReady = Array.isArray(session.questions);

  const currentQuestion = useMemo(() => {
    if (!isReady) return null;
    return questions[currentIndex] ?? null;
  }, [currentIndex, isReady, questions]);

  const completedCount = useMemo(() => completedSet.size, [completedSet]);

  const handleAnswer = (optionIndex: number) => {
    if (!session || !currentQuestion) return;
    if (currentQuestion.selectedChoice !== null) return;

    const selectedChoice = toChoiceLetter(optionIndex);
    const selectedOption = currentQuestion.options[optionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    const updatedQuestions = session.questions.map((question) =>
      question.id === currentQuestion.id
        ? ({ ...question, selectedChoice, isCorrect } as QuizQuestion)
        : question,
    );

    const completedSet = new Set(session.completedSet);
    if (isCorrect) {
      completedSet.add(session.currentIndex);
    }

    const updatedSession = { ...session, questions: updatedQuestions, completedSet };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleNext = () => {
    if (!session || !currentQuestion) return;
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

  const progressDisplayed = completedCount;
  const progressPercent = calculateProgressPercent(completedSet, questions.length);
  const atLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;
  const hasAnsweredCurrent = currentQuestion?.selectedChoice !== null && currentQuestion !== null;
  const canGoNext = Boolean(hasAnsweredCurrent && !atLastQuestion);
  const nextDisabled = !canGoNext;
  const typeLabelMap: Record<QuizQuestion['type'], string> = {
    mcq: 'Multiple choice',
  };
  const statusLabels: Record<QuestionStatus, string> = {
    correct: 'Correct',
    incorrect: 'Incorrect',
    unanswered: 'Pending',
  };
  const currentStatus = currentQuestion ? evaluateStatus(currentQuestion) : 'unanswered';
  const friendlyExplanation = createFriendlyExplanation(
    session.grade,
    currentQuestion?.explanationSteps ?? [],
    currentQuestion?.answer ?? '',
  );
  const explanationSteps = currentQuestion?.explanationSteps ?? [];
  const showFeedback = Boolean(currentQuestion && currentQuestion.selectedChoice !== null);
  const lastAnswerWasCorrect =
    currentQuestion?.selectedChoice === null || !currentQuestion ? null : currentQuestion.isCorrect;
  const completedCorrectList = Array.from(completedSet)
    .sort((a, b) => a - b)
    .map((index) => questions[index]?.id ?? index);
  const missedQuestions = questions.filter(
    (question) => question.selectedChoice !== null && question.isCorrect === false,
  );
  const isSummaryView = isReady && currentIndex >= questions.length;

  useEffect(() => {
    if (!isReady) {
      previousProgressRef.current = 0;
      return;
    }
    if (!import.meta.env.DEV) {
      previousProgressRef.current = progressDisplayed;
      return;
    }
    if (lastAnswerWasCorrect === false && progressDisplayed > previousProgressRef.current) {
      throw new Error('Progress increased after an incorrect answer.');
    }
    previousProgressRef.current = progressDisplayed;
  }, [lastAnswerWasCorrect, progressDisplayed]);

  if (!isReady) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading quiz…</p>
        </section>
      </main>
    );
  }

  if (isSummaryView) {
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
          </header>

          <section className="summary" aria-live="polite">
            <p className="notice">You have reached the end of this quiz session.</p>
            <h2>Summary</h2>
            <p>
              Score: {completedCount} out of {questions.length}
            </p>
            <div className="missed-questions">
              <h3>Missed questions</h3>
              {missedQuestions.length ? (
                <ul>
                  {missedQuestions.map((question) => {
                    const explanation = createFriendlyExplanation(
                      session.grade,
                      question.explanationSteps,
                      question.answer,
                    );
                    return (
                      <li key={question.id}>
                        <p>
                          Question {question.id}: {question.prompt}
                        </p>
                        <p>Correct answer: {question.answer}</p>
                        <div className="explanation">
                          <p>Explanation:</p>
                          <ul className="explanation-steps">
                            {question.explanationSteps.length ? (
                              question.explanationSteps.map((step, index) => (
                                <li key={`${question.id}-${index}`}>{step}</li>
                              ))
                            ) : (
                              <li>No steps available.</li>
                            )}
                          </ul>
                          {explanation && <p className="explanation-summary">{explanation}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No missed questions. Nice work!</p>
              )}
            </div>
          </section>

          <footer className="actions">
            <button type="button" className="secondary" onClick={handleReset}>
              End Session
            </button>
          </footer>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading quiz…</p>
        </section>
      </main>
    );
  }

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
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
              data-testid="progress-fill"
            />
          </div>
          <div className="progress-text">
            <span data-testid="progress-text">
              Correct: {progressDisplayed}/{session.questions.length}
            </span>
            <span>
              Current question {currentQuestion.id}/{session.questions.length}
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
                  disabled={currentQuestion.selectedChoice !== null}
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

        <div className="debug-panel">
          <button
            type="button"
            className="secondary"
            onClick={() => setShowDebug((prev) => !prev)}
            aria-expanded={showDebug}
          >
            Debug
          </button>
          {showDebug && (
            <div className="debug-content" data-testid="debug-panel">
              <p data-testid="debug-current-index">currentIndex: {session.currentIndex}</p>
              <p data-testid="debug-progress-displayed">
                progressDisplayed: {progressDisplayed}
              </p>
              <p data-testid="debug-completed-count">
                completedCorrectCount: {completedCount}
              </p>
              <p data-testid="debug-completed-set">
                completedCorrectSet:{' '}
                {completedCorrectList.length ? completedCorrectList.join(', ') : 'None'}
              </p>
              <p data-testid="debug-last-answer">
                lastAnswerWasCorrect:{' '}
                {lastAnswerWasCorrect === null ? 'null' : String(lastAnswerWasCorrect)}
              </p>
              <p data-testid="debug-can-go-next">canGoNext: {String(canGoNext)}</p>
              <p data-testid="debug-progress-value">
                Progress value: {progressDisplayed}/{session.questions.length} ({progressPercent}%)
              </p>
            </div>
          )}
        </div>

        <footer className="actions">
          <button type="button" className="secondary" onClick={handleReset}>
            End Session
          </button>
          <button type="button" className="primary" onClick={handleNext} disabled={nextDisabled}>
            Next
          </button>
        </footer>

          {atLastQuestion && hasAnsweredCurrent && (
            <section className="summary" aria-live="polite">
              <p className="notice">You have reached the end of this quiz session.</p>
              <h2>Summary</h2>
              <p>
                Score: {completedCount} out of {questions.length}
              </p>
              <div className="missed-questions">
                <h3>Missed questions</h3>
                {missedQuestions.length ? (
                  <ul>
                    {missedQuestions.map((question) => {
                      const explanation = createFriendlyExplanation(
                        session.grade,
                        question.explanationSteps,
                        question.answer,
                      );
                      return (
                        <li key={question.id}>
                          <p>
                            Question {question.id}: {question.prompt}
                          </p>
                          <p>Correct answer: {question.answer}</p>
                          <div className="explanation">
                            <p>Explanation:</p>
                            <ul className="explanation-steps">
                              {question.explanationSteps.length ? (
                                question.explanationSteps.map((step, index) => (
                                  <li key={`${question.id}-${index}`}>{step}</li>
                                ))
                              ) : (
                                <li>No steps available.</li>
                              )}
                            </ul>
                            {explanation && <p className="explanation-summary">{explanation}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No missed questions. Nice work!</p>
                )}
              </div>
            </section>
          )}
      </section>
    </main>
  );
};

export default Quiz;
