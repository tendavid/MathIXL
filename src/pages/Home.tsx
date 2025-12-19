import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildSession, saveSession } from '../utils/session';
import { getProgressionLabel } from '../utils/progressionLabel';

const grades = Array.from({ length: 12 }, (_, index) => index + 1);
const numberRange = Array.from({ length: 50 }, (_, index) => index + 1);
const points = Array.from({ length: 5 }, (_, index) => index + 1);

const Home = () => {
  const [grade, setGrade] = useState<number | ''>('');
  const [point, setPoint] = useState<number | ''>('');
  const [numberLimit, setNumberLimit] = useState<number | ''>('');
  const navigate = useNavigate();

  const canStart = useMemo(
    () => grade !== '' && point !== '' && numberLimit !== '',
    [grade, numberLimit, point],
  );

  useEffect(() => {
    setPoint('');
  }, [grade]);

  const pointOptions = useMemo(() => {
    if (grade === '') return [];
    return points.map((value) => {
      const label = `Progression ${value} — ${getProgressionLabel(grade, value)}`;
      return { value, label };
    });
  }, [grade]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canStart || grade === '' || point === '' || numberLimit === '') return;
    const session = buildSession(grade, point, numberLimit);
    saveSession(session);
    navigate('/quiz');
  };

  return (
    <main className="page">
      <div className="page-banner">
        <h1 className="page-banner__title">Daily Math Quiz</h1>
      </div>
      <section className="card">
        <p className="subtitle">
          Choose your setting to start 15 daily math quiz session.
          <br />
          The session ends after 15 correct answers or a total of 25 questions.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">Grade</span>
            <div className="card-grid">
              {grades.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`selector-card${grade === value ? ' selector-card--selected' : ''}`}
                  onClick={() => setGrade(value)}
                >
                  Grade {value}
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span className="label">Progression</span>
            <div className="card-grid">
              {pointOptions.length === 0 ? (
                <span className="field-hint">Select a grade to unlock progression levels.</span>
              ) : null}
              {pointOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`selector-card${point === option.value ? ' selector-card--selected' : ''}`}
                  onClick={() => setPoint(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span className="label">Number limit</span>
            <div className="card-grid card-grid--compact">
              {numberRange.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`selector-card selector-card--compact${
                    numberLimit === value ? ' selector-card--selected' : ''
                  }`}
                  onClick={() => setNumberLimit(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </label>

          <button className="primary" type="submit" disabled={!canStart}>
            Start
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;
