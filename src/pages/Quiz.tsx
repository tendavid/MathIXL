import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, loadSession, saveSession, QuizQuestion, QuizSession } from '../utils/session';

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

  const answeredCount = useMemo(
    () => session?.questions.filter((question) => question.selectedIndex !== null).length ?? 0,
    [session],
  );

  const handleAnswer = (optionIndex: number) => {
    if (!session || !currentQuestion) return;
    const updatedQuestions = session.questions.map((question) =>
      question.id === currentQuestion.id
        ? ({ ...question, selectedIndex: optionIndex } as QuizQuestion)
        : question,
    );
    const updatedSession = { ...session, questions: updatedQuestions };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleNext = () => {
    if (!session || !currentQuestion) return;
    const hasSelection = currentQuestion.selectedIndex !== null;
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
  const nextDisabled = currentQuestion.selectedIndex === null || atLastQuestion;

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
          <p className="prompt">{currentQuestion.prompt}</p>
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
