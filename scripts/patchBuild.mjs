import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sessionPath = resolve('build/utils/session.js');

if (existsSync(sessionPath)) {
  const content = readFileSync(sessionPath, 'utf8');
  const updated = content.replace(`from './questionGenerator'`, `from './questionGenerator.js'`);
  if (content !== updated) {
    writeFileSync(sessionPath, updated, 'utf8');
  }
}
