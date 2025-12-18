import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  generateQuestions,
  getTemplatesForCode,
} from '../build/utils/questionGenerator.js';
import { buildSession } from '../build/utils/session.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pacingData = JSON.parse(
  readFileSync(resolve(__dirname, '../build/data/pacing.json'), 'utf8'),
);

describe('question generation', () => {
  it('always returns 15 questions', () => {
    const { questions } = generateQuestions(4, 2, 20, 'ABCDE-4-2-20');
    assert.equal(questions.length, 15);
  });

  it('uses valid CCSS codes for the selected grade and point', () => {
    const grade = 5;
    const point = 3;
    const { questions, allowedCcssCodes } = generateQuestions(grade, point, 12, 'GRADE5POINT3');
    const codes = pacingData[String(grade)][String(point)].ccssCodes;
    questions.forEach((question) => {
      assert.ok(
        codes.includes(question.ccssCode),
        `Expected ${question.ccssCode} to be one of ${codes.join(', ')}`,
      );
      assert.ok(
        allowedCcssCodes.includes(question.ccssCode),
        `Expected ${question.ccssCode} to survive the constraint layer`,
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

  const combos = [
    { grade: 1, point: 1 },
    { grade: 3, point: 2 },
    { grade: 5, point: 4 },
    { grade: 7, point: 3 },
    { grade: 10, point: 3 },
  ];

  combos.forEach(({ grade, point }) => {
    it(`uses only allowed templates for grade ${grade}, point ${point}`, () => {
      const { questions, allowedCcssCodes } = generateQuestions(
        grade,
        point,
        20,
        `CHECK-${grade}-${point}`,
      );
      assert.ok(allowedCcssCodes.length > 0, 'Constraint layer returned no allowed CCSS codes');
      questions.forEach((question) => {
        const templates = getTemplatesForCode(question.ccssCode, grade, point);
        const ids = templates.map((template) => template.id);
        assert.ok(
          ids.includes(question.templateId),
          `Template ${question.templateId} not allowed for ${question.ccssCode} (grade ${grade}, point ${point})`,
        );
        assert.notEqual(
          question.templateId,
          'unknown-template',
          'Fallback generic template should never be used',
        );
      });
    });
  });
});
