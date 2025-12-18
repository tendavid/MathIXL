import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, loadSession, saveSession } from '../utils/session';
import { QuizQuestion, QuizSession } from '../types/quiz';

const Quiz = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [responseDraft, setResponseDraft] = useState<string>('');

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

  const isQuestionAnswered = (question: QuizQuestion) =>
    question.type === 'mcq'
      ? question.selectedIndex !== null
      : (question.response ?? '').trim().length > 0;

  useEffect(() => {
    if (!session || !currentQuestion) return;
    if (currentQuestion.type === 'mcq') {
      setResponseDraft('');
      return;
    }
    setResponseDraft(currentQuestion.response ?? '');
  }, [currentQuestion, session]);

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return session.questions.filter((question) => isQuestionAnswered(question)).length;
  }, [session]);

  const handleAnswer = (optionIndex: number) => {
    if (!session || !currentQuestion || currentQuestion.type !== 'mcq') return;
    const updatedQuestions = session.questions.map((question) =>
      question.id === currentQuestion.id
        ? ({ ...question, selectedIndex: optionIndex } as QuizQuestion)
        : question,
    );
    const updatedSession = { ...session, questions: updatedQuestions };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleResponseChange = (value: string) => {
    if (!session || !currentQuestion || currentQuestion.type === 'mcq') return;
    setResponseDraft(value);
    const updatedQuestions = session.questions.map((question) =>
      question.id === currentQuestion.id ? ({ ...question, response: value } as QuizQuestion) : question,
    );
    const updatedSession = { ...session, questions: updatedQuestions };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleNext = () => {
    if (!session || !currentQuestion) return;
    const hasSelection = isQuestionAnswered(currentQuestion);
    if (!hasSelection) return;
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

  const progressPercent = Math.round((answeredCount / session.questions.length) * 100);
  const atLastQuestion = session.currentIndex === session.questions.length - 1;
  const nextDisabled = !isQuestionAnswered(currentQuestion) || atLastQuestion;
  const allowedCodes = session.allowedCcssCodes ?? [];
  const typeLabelMap: Record<QuizQuestion['type'], string> = {
    mcq: 'Multiple choice',
    numeric: 'Numeric response',
    text: 'Short explanation',
  };

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
            <span>
              Question {session.currentIndex + 1} / {session.questions.length}
            </span>
            <span>
              {answeredCount}/{session.questions.length} answered
            </span>
          </div>
        </div>

        <article className="question">
          <div className="question-header">
            <p className="prompt">{currentQuestion.prompt}</p>
            <span className="type-pill">{typeLabelMap[currentQuestion.type]}</span>
          </div>

          {currentQuestion.type === 'mcq' && (
            <div className="options">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentQuestion.selectedIndex === index;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type !== 'mcq' && (
            <div className="response">
              <label className="label" htmlFor={`response-${currentQuestion.id}`}>
                Your response
              </label>
              <input
                id={`response-${currentQuestion.id}`}
                type="text"
                value={responseDraft}
                onChange={(event) => handleResponseChange(event.target.value)}
                placeholder={
                  currentQuestion.type === 'numeric'
                    ? 'Enter a number or expression'
                    : 'Explain your reasoning briefly'
                }
              />
            </div>
          )}

          <p className="ccss">CCSS: {currentQuestion.ccssCode}</p>
          <p className="ccss">Template: {currentQuestion.templateId ?? 'unknown'}</p>
        </article>

        <footer className="actions">
          <button type="button" className="secondary" onClick={handleReset}>
            End Session
          </button>
          <button type="button" className="primary" onClick={handleNext} disabled={nextDisabled}>
            Next
          </button>
        </footer>

        {atLastQuestion && currentQuestion.selectedIndex !== null && (
          <p className="notice">You have reached the end of this quiz session.</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
