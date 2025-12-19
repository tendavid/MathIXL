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
          <div className="selector-layout">
            <label className="field">
              <span className="section-header">Grade</span>
              <div className="card-grid card-grid--scroll">
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
              <span className="section-header">Progression</span>
              <div className="card-grid card-grid--progression">
                {pointOptions.length === 0 ? (
                  <span className="field-hint">Select a grade to unlock progression levels.</span>
                ) : null}
                {pointOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`selector-card selector-card--progression${
                      point === option.value ? ' selector-card--selected' : ''
                    }`}
                    onClick={() => setPoint(option.value)}
                  >
                    <span className="selector-card__label">{option.label}</span>
                  </button>
                ))}
              </div>
            </label>

            <label className="field">
              <span className="section-header">Number limit</span>
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
          </div>

          <button className="primary form__submit" type="submit" disabled={!canStart}>
            Start
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;
