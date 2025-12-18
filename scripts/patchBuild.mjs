import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sessionPath = resolve('build/utils/session.js');
const quizPath = resolve('build/pages/Quiz.js');
const questionGeneratorPath = resolve('build/utils/questionGenerator.js');

const patchImport = (filePath, search, replacement) => {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  const updated = content.replace(search, replacement);
  if (content !== updated) {
    writeFileSync(filePath, updated, 'utf8');
  }
};

patchImport(sessionPath, `from './questionGenerator'`, `from './questionGenerator.js'`);
patchImport(sessionPath, `from './explanation'`, `from './explanation.js'`);
patchImport(quizPath, `from '../utils/session'`, `from '../utils/session.js'`);
patchImport(quizPath, `from '../utils/explanation'`, `from '../utils/explanation.js'`);
patchImport(questionGeneratorPath, `from './explanation'`, `from './explanation.js'`);
