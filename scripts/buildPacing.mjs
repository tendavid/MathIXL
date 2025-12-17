import { inflateSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const pdfFiles = [
  path.join(projectRoot, 'docs', 'CA_CCSS_Math_5Point_Pacing_Quiz_Guide_Grades_1.pdf'),
  path.join(projectRoot, 'docs', 'CA_CCSS_Math_5Point_Pacing_Quiz_Guide_Grades_2_to_12.pdf'),
];

const outputPath = path.join(projectRoot, 'src', 'data', 'pacing.json');

const decodeAscii85 = (input) => {
  const text = input.toString('ascii').replace(/\s+/g, '');
  let clean = text;
  if (clean.startsWith('<~')) clean = clean.slice(2);
  if (clean.endsWith('~>')) clean = clean.slice(0, -2);

  const output = [];
  let chunk = '';

  const pushChunk = (segment) => {
    let value = 0;
    for (const char of segment) {
      value = value * 85 + (char.charCodeAt(0) - 33);
    }
    for (let i = 3; i >= 0; i -= 1) {
      output.push((value >> (8 * i)) & 0xff);
    }
  };

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (char === 'z' && chunk.length === 0) {
      output.push(0, 0, 0, 0);
      continue;
    }
    chunk += char;
    if (chunk.length === 5) {
      pushChunk(chunk);
      chunk = '';
    }
  }

  if (chunk.length > 0) {
    const padded = chunk.padEnd(5, 'u');
    pushChunk(padded);
    output.splice(output.length - (5 - chunk.length), 5 - chunk.length);
  }

  return Buffer.from(output);
};

const extractStreams = (filePath) => {
  const data = readFileSync(filePath);
  const pattern = /(\d+)\s+\d+\s+obj([\s\S]*?)stream\r?\n/g;
  const streams = [];

  let match;
  while ((match = pattern.exec(data)) !== null) {
    const [, , before] = match;
    const lengthMatch = /\/Length\s+(\d+)/.exec(before);
    if (!lengthMatch) continue;
    const length = Number(lengthMatch[1]);
    const start = match.index + match[0].length;
    const raw = data.subarray(start, start + length);
    streams.push(raw);
  }

  return streams;
};

const toPlainTextLines = (stream) => {
  const decoded = decodeAscii85(stream);
  const inflated = inflateSync(decoded).toString('latin1');

  const tokens = inflated.match(/\((?:\\.|[^()])+\)|T\*|Tj/g) ?? [];
  const lines = [];
  let current = '';

  const replaceEscapes = (value) =>
    value
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\226/g, '–')
      .replace(/\\227/g, '—')
      .replace(/\\273/g, '≈')
      .replace(/\\177/g, '•');

  tokens.forEach((token) => {
    if (token === 'T*') {
      if (current.trim()) lines.push(current.trim());
      current = '';
      return;
    }
    if (token === 'Tj') return;
    const content = replaceEscapes(token.slice(1, -1));
    current += content;
  });

  if (current.trim()) lines.push(current.trim());
  return lines;
};

const parsePacing = (lines) => {
  const debug = process.env.DEBUG_PACING === '1';
  const pacing = {};
  let currentGrade = null;
  let currentPoint = null;
  let currentField = null;
  let grade11Hits = 0;

  const ensurePoint = (grade, point, title) => {
    if (!pacing[grade]) pacing[grade] = {};
    pacing[grade][point] = pacing[grade][point] || {
      title,
      ccssCodes: [],
      masteryText: '',
      quizGuidanceText: '',
      sampleItems: [],
    };
  };

  lines.forEach((line) => {
    if (/^Algebra I \(Grade 9 typical\)/i.test(line)) {
      currentGrade = '9';
      currentPoint = null;
      currentField = null;
      if (!pacing[currentGrade]) pacing[currentGrade] = {};
      return;
    }
    if (/^Geometry \(Grade 10 typical\)/i.test(line)) {
      currentGrade = '10';
      currentPoint = null;
      currentField = null;
      if (!pacing[currentGrade]) pacing[currentGrade] = {};
      return;
    }
    if (/^Algebra II \(Grade 11 typical\)/i.test(line)) {
      currentGrade = '11';
      currentPoint = null;
      currentField = null;
    if (!pacing[currentGrade]) pacing[currentGrade] = {};
    grade11Hits += 1;
    if (debug) console.log('Directly set grade 11 from line:', line);
    return;
  }

    let algebraMatch = /(Algebra I \(Grade 9 typical\)|Geometry \(Grade 10 typical\)|Algebra II \(Grade 11 typical\))/i.exec(
      line,
    );
    if (!algebraMatch) {
      if (/Algebra I/i.test(line) && /Grade 9/i.test(line)) {
        algebraMatch = ['Algebra I (Grade 9 typical)', 'Algebra I (Grade 9 typical)'];
      } else if (/Geometry/i.test(line) && /Grade 10/i.test(line)) {
        algebraMatch = ['Geometry (Grade 10 typical)', 'Geometry (Grade 10 typical)'];
      } else if (/Algebra II/i.test(line) && /Grade 11/i.test(line)) {
        algebraMatch = ['Algebra II (Grade 11 typical)', 'Algebra II (Grade 11 typical)'];
      }
    }
    const gradeMatch = /^Grade (\d+)/i.exec(line);
    if (debug && line.includes('Grade 11')) {
      console.log('Grade 11 line match result:', algebraMatch);
      console.log('Algebra match truthy?', Boolean(algebraMatch));
    }
    if (algebraMatch) {
      const label = algebraMatch[1];
      if (label.startsWith('Algebra I')) currentGrade = '9';
      else if (label.startsWith('Geometry')) currentGrade = '10';
      else currentGrade = '11';
      if (debug && currentGrade === '11') console.log('Set current grade to 11 from line:', line);
      currentPoint = null;
      currentField = null;
      if (!pacing[currentGrade]) pacing[currentGrade] = {};
      if (currentGrade === '11') grade11Hits += 1;
      if (debug && currentGrade === '11') console.log('Grade 11 init:', pacing[currentGrade]);
      return;
    }

    if (gradeMatch) {
      currentGrade = gradeMatch[1];
      currentPoint = null;
      currentField = null;
      if (!pacing[currentGrade]) pacing[currentGrade] = {};
      return;
    }

    if (!currentGrade) return;

    const pointMatch = /^Point (\d)\s*\(≈2-month window\):\s*(.+)$/i.exec(line);
    if (pointMatch) {
      currentPoint = pointMatch[1];
      ensurePoint(currentGrade, currentPoint, pointMatch[2]);
      currentField = null;
      return;
    }

    if (!currentPoint) return;

    const ccssMatch = /^CCSS codes:\s*(.+)$/i.exec(line);
    if (ccssMatch) {
      const codes = ccssMatch[1]
        .split(',')
        .map((code) => code.trim())
        .filter(Boolean);
      pacing[currentGrade][currentPoint].ccssCodes = codes;
      currentField = null;
      return;
    }

    const masteryMatch = /^What mastery looks like:\s*(.*)$/i.exec(line);
    if (masteryMatch) {
      pacing[currentGrade][currentPoint].masteryText = masteryMatch[1].trim();
      currentField = 'masteryText';
      return;
    }

    const guidanceMatch = /^Quiz guidance:\s*(.*)$/i.exec(line);
    if (guidanceMatch) {
      pacing[currentGrade][currentPoint].quizGuidanceText = guidanceMatch[1].trim();
      currentField = 'quizGuidanceText';
      return;
    }

    if (/^Sample quiz items:/i.test(line)) {
      currentField = 'sampleItems';
      return;
    }

    if (currentField === 'masteryText') {
      const target = pacing[currentGrade][currentPoint];
      target.masteryText = `${target.masteryText} ${line}`.trim();
    } else if (currentField === 'quizGuidanceText') {
      const target = pacing[currentGrade][currentPoint];
      target.quizGuidanceText = `${target.quizGuidanceText} ${line}`.trim();
    } else if (currentField === 'sampleItems') {
      if (line === '•') return;
      pacing[currentGrade][currentPoint].sampleItems.push(line);
    }
  });

  if (debug) console.log('Grade 11 hits counted:', grade11Hits);
  return { pacing, grade11Hits };
};

const validatePacing = (pacing) => {
  for (let grade = 1; grade <= 12; grade += 1) {
    const gradeKey = grade.toString();
    if (!pacing[gradeKey]) throw new Error(`Missing grade ${gradeKey}`);
    for (let point = 1; point <= 5; point += 1) {
      const pointKey = point.toString();
      const pointData = pacing[gradeKey][pointKey];
      if (!pointData) throw new Error(`Missing point ${pointKey} for grade ${gradeKey}`);
      if (!pointData.ccssCodes.length) {
        throw new Error(`Missing CCSS codes for grade ${gradeKey}, point ${pointKey}`);
      }
    }
  }
};

const main = () => {
  const debug = process.env.DEBUG_PACING === '1';
  const allLines = pdfFiles
    .flatMap((file) => extractStreams(file))
    .flatMap((stream) => toPlainTextLines(stream));

  const { pacing, grade11Hits } = parsePacing(allLines);
  if (debug) {
    console.log('Parsed grades:', Object.keys(pacing).sort((a, b) => Number(a) - Number(b)));
    const grade11Line = allLines.find((line) => line.includes('Grade 11'));
    console.log('Sample Grade 11 line:', grade11Line);
    console.log('Grade 11 entry:', pacing['11']);
    console.log('Grade 11 hits inside parser:', grade11Hits);
  }
  validatePacing(pacing);
  writeFileSync(outputPath, `${JSON.stringify(pacing, null, 2)}\n`, 'utf8');
  console.log(`Wrote pacing data to ${outputPath}`);
};

main();
