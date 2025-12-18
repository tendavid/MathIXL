import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sessionPath = resolve('build/utils/session.js');
const quizPath = resolve('build/pages/Quiz.js');

if (existsSync(sessionPath)) {
  const content = readFileSync(sessionPath, 'utf8');
  const updated = content.replace(`from './questionGenerator'`, `from './questionGenerator.js'`);
  if (content !== updated) {
    writeFileSync(sessionPath, updated, 'utf8');
  }
}

if (existsSync(quizPath)) {
  const content = readFileSync(quizPath, 'utf8');
  const updated = content.replace(`from '../utils/session'`, `from '../utils/session.js'`);
  if (content !== updated) {
    writeFileSync(quizPath, updated, 'utf8');
  }
}
