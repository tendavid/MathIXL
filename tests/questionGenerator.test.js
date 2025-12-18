import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { generateQuestions } from '../build/utils/questionGenerator.js';
import { buildSession } from '../build/utils/session.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pacingData = JSON.parse(
  readFileSync(resolve(__dirname, '../build/data/pacing.json'), 'utf8'),
);

describe('question generation', () => {
  it('always returns 15 questions', () => {
    const questions = generateQuestions(4, 2, 20, 'ABCDE-4-2-20');
    assert.equal(questions.length, 15);
  });

  it('uses valid CCSS codes for the selected grade and point', () => {
    const grade = 5;
    const point = 3;
    const questions = generateQuestions(grade, point, 12, 'GRADE5POINT3');
    const codes = pacingData[String(grade)][String(point)].ccssCodes;
    questions.forEach((question) => {
      assert.ok(
        codes.includes(question.ccssCode),
        `Expected ${question.ccssCode} to be one of ${codes.join(', ')}`,
      );
    });
  });

  it('is repeatable for the same session code', () => {
    const grade = 7;
    const point = 4;
    const numberLimit = 30;
    const code = 'SEED7';
    const sessionA = buildSession(grade, point, numberLimit, code);
    const sessionB = buildSession(grade, point, numberLimit, code);
    assert.deepStrictEqual(sessionA.questions, sessionB.questions);
  });
});
