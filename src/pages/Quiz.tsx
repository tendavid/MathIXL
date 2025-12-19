import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, loadSession, saveSession } from '../utils/session';
import { QuestionStatus, QuizQuestion, QuizSession } from '../types/quiz';
import { createFriendlyExplanation, toChoiceLetter } from '../utils/explanation';
import { generateQuestion } from '../utils/questionGenerator';
import { getProgressionLabel } from '../utils/progressionLabel';
import { playCorrect, playWrong } from '../utils/sfx';

export const evaluateStatus = (question: QuizQuestion): QuestionStatus => {
  if (question.isCorrect === null) return 'unanswered';
  return question.isCorrect ? 'correct' : 'incorrect';
};

export const calculateProgressPercent = (correctCount: number | Set<number>, goalCorrect: number) => {
  const normalizedCount = correctCount instanceof Set ? correctCount.size : correctCount;
  return Math.round((normalizedCount / Math.max(1, goalCorrect)) * 100);
};

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);
  const previousProgressRef = useRef(0);
  const correctPhraseIndexRef = useRef(0);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackVariant, setFeedbackVariant] = useState<'correct' | 'incorrect' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem('quiz-sound-enabled');
    if (stored === null) return true;
    return stored === 'true';
  });
  const correctPhrases = useMemo(
    () => ['Great job!', 'Nice work!', 'Awesome!', 'You got it!', 'Keep it up!'],
    [],
  );

  useEffect(() => {
    const storedSession = loadSession();
    if (!storedSession) {
      navigate('/');
      return;
    }
    setSession(storedSession);
  }, [navigate]);

  const questions = session?.questions ?? [];
  const currentIndex = session?.currentIndex ?? 0;
  const completedSet = session?.completedSet ?? new Set<number>();
  const isReady = Boolean(session && Array.isArray(session.questions));

  const currentQuestion = useMemo(() => {
    if (!isReady) return null;
    return questions[currentIndex] ?? null;
  }, [currentIndex, isReady, questions]);

  const correctCount = session?.correctCount ?? completedSet.size;
  const attemptedCount = session?.attemptedCount ?? 0;
  const goalCorrect = session?.goalCorrect ?? 15;
  const maxAttempts = 25;

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

    const updatedSession = {
      ...session,
      questions: updatedQuestions,
      completedSet,
      attemptedCount: session.attemptedCount + 1,
      correctCount: session.correctCount + (isCorrect ? 1 : 0),
    };
    setSession(updatedSession);
    saveSession(updatedSession);

    const nextMessage = isCorrect
      ? correctPhrases[correctPhraseIndexRef.current % correctPhrases.length]
      : 'Not quite — try again.';
    if (isCorrect) {
      correctPhraseIndexRef.current =
        (correctPhraseIndexRef.current + 1) % correctPhrases.length;
    }
    setFeedbackMessage(nextMessage);
    setFeedbackVariant(isCorrect ? 'correct' : 'incorrect');
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackVariant(null);
    }, 1200);

    if (soundEnabled) {
      if (isCorrect) {
        playCorrect();
      } else {
        playWrong();
      }
    }
  };

  const handleNext = () => {
    if (!session || !currentQuestion) return;
    if (session.correctCount >= session.goalCorrect || session.attemptedCount >= maxAttempts) return;

    const nextIndex = session.currentIndex + 1;
    if (nextIndex < session.questions.length) {
      const updatedSession = { ...session, currentIndex: nextIndex };
      setSession(updatedSession);
      saveSession(updatedSession);
      return;
    }

    const usedPrompts = new Set(session.questions.map((question) => question.prompt));
    const questionIndex = session.questions.length;
    let attempts = 0;
    let candidateQuestion = generateQuestion(
      session.grade,
      session.point,
      session.numberLimit,
      `${session.seedBase}-${session.nextQuestionIndex}-${attempts}`,
      questionIndex,
    );

    while (usedPrompts.has(candidateQuestion.prompt) && attempts < 5) {
      attempts += 1;
      candidateQuestion = generateQuestion(
        session.grade,
        session.point,
        session.numberLimit,
        `${session.seedBase}-${session.nextQuestionIndex}-${attempts}`,
        questionIndex,
      );
    }

    const updatedSession = {
      ...session,
      questions: [...session.questions, candidateQuestion],
      currentIndex: nextIndex,
      nextQuestionIndex: session.nextQuestionIndex + 1,
    };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleReset = () => {
    clearSession();
    setSession(null);
    navigate('/');
  };

  const progressDisplayed = correctCount;
  const progressPercent = calculateProgressPercent(correctCount, goalCorrect);
  const isComplete = correctCount >= goalCorrect;
  const hasReachedMaxAttempts = attemptedCount >= maxAttempts;
  const hasAnsweredCurrent = currentQuestion?.selectedChoice !== null && currentQuestion !== null;
  const canGoNext = Boolean(hasAnsweredCurrent && !isComplete && !hasReachedMaxAttempts);
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
  const explanationSteps = currentQuestion?.explanationSteps ?? [];
  const showFeedback = Boolean(currentQuestion && currentQuestion.selectedChoice !== null);
  const lastAnswerWasCorrect =
    currentQuestion?.selectedChoice === null || !currentQuestion ? null : currentQuestion.isCorrect;
  const isSummaryView = isReady && (isComplete || hasReachedMaxAttempts);

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

  useEffect(() => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    setFeedbackMessage(null);
    setFeedbackVariant(null);
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('quiz-sound-enabled', String(soundEnabled));
  }, [soundEnabled]);

  if (!session) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading quiz…</p>
        </section>
      </main>
    );
  }

  const s = session;
  const progressionLabel = getProgressionLabel(s.grade, s.point);
  const headerText = `Grade ${s.grade} - Progression ${s.point} : ${progressionLabel} - Number ${s.numberLimit}`;
  const friendlyExplanation = createFriendlyExplanation(
    s.grade,
    currentQuestion?.explanationSteps ?? [],
    currentQuestion?.answer ?? '',
  );

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
    const duration = formatDuration(Date.now() - s.startTime);
    const summaryNotice = isComplete
      ? `You reached the goal of ${goalCorrect} correct answers.`
      : `You reached the maximum of ${maxAttempts} questions.`;
    return (
      <main className="page">
        <section className="card">
          <header className="quiz-header">
            <div>
              <p className="label">Session Code</p>
              <p className="code">{s.code}</p>
            </div>
            <div className="meta">
              <span>{headerText}</span>
            </div>
          </header>

          <section className="summary" aria-live="polite">
            <p className="notice">{summaryNotice}</p>
            <div className="completion-panel">
              <p>
                <strong>Session Code:</strong> {s.code}
              </p>
              <p>
                <strong>Time:</strong> {duration}
              </p>
              <p>
                <strong>Correct:</strong> {correctCount}/{goalCorrect}
              </p>
              <p>
                <strong>Attempts:</strong> {attemptedCount}
              </p>
            </div>
            <h2>Summary</h2>
            <p>
              Score: {correctCount} out of {goalCorrect}
            </p>
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
            <p className="code">{s.code}</p>
          </div>
          <div className="meta">
            <span>{headerText}</span>
          </div>
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
              Correct: {progressDisplayed}/{goalCorrect}
            </span>
            <span className="attempted-count">Attempted: {attemptedCount}</span>
            <span>
              Current question {currentQuestion.id}/{s.questions.length}
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

          {feedbackMessage && (
            <div
              className={`answer-feedback ${feedbackVariant ?? ''}`}
              aria-live="polite"
            >
              {feedbackMessage}
            </div>
          )}

          <div className="quiz-settings">
            <label className="sound-toggle" htmlFor="sound-toggle">
              Sound:
            </label>
            <button
              id="sound-toggle"
              type="button"
              className="sound-toggle-button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? 'On' : 'Off'}
            </button>
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

        </article>

        <footer className="actions">
          <button type="button" className="secondary" onClick={handleReset}>
            End Session
          </button>
          <button type="button" className="primary" onClick={handleNext} disabled={nextDisabled}>
            Next
          </button>
        </footer>
      </section>
    </main>
  );
};

export default Quiz;
