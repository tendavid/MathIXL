import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildSession, saveSession } from '../utils/session';

const grades = Array.from({ length: 12 }, (_, index) => index + 1);
const points = Array.from({ length: 5 }, (_, index) => index + 1);
const numberRange = Array.from({ length: 50 }, (_, index) => index + 1);

const Home = () => {
  const [grade, setGrade] = useState<number | ''>('');
  const [point, setPoint] = useState<number | ''>('');
  const [numberLimit, setNumberLimit] = useState<number | ''>('');
  const navigate = useNavigate();

  const canStart = useMemo(
    () => grade !== '' && point !== '' && numberLimit !== '',
    [grade, numberLimit, point],
  );

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
        <h1 className="page-banner__title">MathIXL is running</h1>
      </div>
      <section className="card">
        <h1 className="title">MathIXL Quiz Builder</h1>
        <p className="subtitle">Choose your settings to start a 15-question practice session.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">Grade</span>
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} required>
              <option value="" disabled>
                Select grade
              </option>
              {grades.map((value) => (
                <option key={value} value={value}>
                  Grade {value}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Point</span>
            <select value={point} onChange={(e) => setPoint(Number(e.target.value))} required>
              <option value="" disabled>
                Select point level
              </option>
              {points.map((value) => (
                <option key={value} value={value}>
                  Point {value}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Number limit</span>
            <select
              value={numberLimit}
              onChange={(e) => setNumberLimit(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select a number between 1 and 50
              </option>
              {numberRange.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
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
