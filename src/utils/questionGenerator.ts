import pacingData from '../data/pacing.json' with { type: 'json' };
import { QuestionType, QuizQuestion } from '../types/quiz';
import { buildExplanationFromSteps, createFriendlyExplanation, normalizeExplanationSteps } from './explanation';

type PacingPoint = {
  ccssCodes: string[];
};

type PacingData = Record<string, Record<string, PacingPoint>>;

const pacing = pacingData as PacingData;

type SeededRandom = () => number;

export type TemplateBuilderArgs = {
  rand: SeededRandom;
  index: number;
  difficulty: number;
  grade: number;
  point: number;
  ccssCode: string;
};

type TemplateBuildResult = {
  prompt: string;
  answer: string;
  explanation: string;
  explanationSteps: string[];
  options?: string[];
};

export type TemplateDefinition = {
  id: string;
  name: string;
  ccssPatterns: string[];
  gradeRange: [number, number];
  points: number[];
  build: (args: TemplateBuilderArgs) => TemplateBuildResult;
};

export type GeneratedQuestionSet = {
  questions: QuizQuestion[];
  allowedCcssCodes: string[];
};

const clampNumberLimit = (value: number) => Math.min(50, Math.max(1, Math.round(value)));

const createSeededRandom = (seed: string): SeededRandom => {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += hash << 13;
    hash ^= hash >>> 7;
    hash += hash << 3;
    hash ^= hash >>> 17;
    hash += hash << 5;
    return (hash >>> 0) / 4294967296;
  };
};

const randomInt = (rand: SeededRandom, min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

const shuffle = <T>(rand: SeededRandom, list: T[]): T[] => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const finalizeOptions = (rand: SeededRandom, answer: string, candidates: string[]) => {
  const unique = [answer, ...candidates.filter((option) => option !== answer)];
  const deduped = unique.filter((option, index) => unique.indexOf(option) === index);
  const numericMatch = answer.match(/-?\d+(?:\.\d+)?/);
  const numericValue = numericMatch ? Number(numericMatch[0]) : null;
  let fallbackIndex = 0;

  while (deduped.length < 4) {
    let fallback = '';
    if (numericMatch && numericValue !== null && Number.isFinite(numericValue)) {
      const magnitude = Math.floor(fallbackIndex / 2) + 1;
      const direction = fallbackIndex % 2 === 0 ? 1 : -1;
      const nextValue = numericValue + magnitude * direction;
      fallback = answer.replace(numericMatch[0], nextValue.toString());
    } else {
      const fallbackLabels = [
        `Not ${answer}`,
        `Almost ${answer}`,
        `A different result than ${answer}`,
        `Close to ${answer}`,
      ];
      fallback = fallbackLabels[fallbackIndex % fallbackLabels.length];
    }

    fallbackIndex += 1;
    if (!deduped.includes(fallback)) {
      deduped.push(fallback);
    }
  }

  return shuffle(rand, deduped.slice(0, 4));
};

const buildTextFallbackOptions = (rand: SeededRandom, answer: string) =>
  finalizeOptions(rand, answer, [
    `${answer} without units`,
    `${answer} but using the wrong operation`,
    `${answer} after rounding too early`,
  ]);

const withExplanation = (steps: string[]): Pick<TemplateBuildResult, 'explanation' | 'explanationSteps'> => {
  const normalizedSteps = normalizeExplanationSteps(steps);
  return {
    explanationSteps: normalizedSteps,
    explanation: buildExplanationFromSteps(normalizedSteps),
  };
};

const scaleWithDifficulty = (difficulty: number, min: number, max: number) => {
  const normalized = clampNumberLimit(difficulty) / 50;
  return Math.round(min + normalized * (max - min));
};

const buildMcqOptions = (rand: SeededRandom, answer: number, difficulty: number) => {
  const safeAnswer = Number.isFinite(answer) ? answer : 0;
  const spread = Math.max(3, Math.round(difficulty / 4));
  const options = new Set<number>([safeAnswer]);
  let attempts = 0;

  while (options.size < 4 && attempts < 50) {
    attempts += 1;
    const offset = randomInt(rand, 1, spread);
    const direction = rand() > 0.5 ? 1 : -1;
    const candidate = Math.max(0, safeAnswer + offset * direction);
    const distractor = Number.isFinite(candidate) ? candidate : safeAnswer + offset + attempts;
    options.add(distractor === safeAnswer ? distractor + 1 : distractor);
  }

  while (options.size < 4) {
    options.add(safeAnswer + options.size);
  }

  return shuffle(
    rand,
    Array.from(options).map((value) => value.toString()),
  );
};

const sanitizeCcssCode = (code: string) => code.trim().split(' ')[0].replace(/[–—]/g, '-');

const matchesPattern = (code: string, pattern: string) => {
  const normalizedCode = sanitizeCcssCode(code).replace(/-\\d.*$/, '').toUpperCase();
  const normalizedPattern = pattern.replace(/[–—]/g, '-').toUpperCase();
  if (normalizedPattern.endsWith('*')) {
    return normalizedCode.startsWith(normalizedPattern.slice(0, -1));
  }
  return normalizedCode === normalizedPattern;
};

const buildArithmeticQuestion = (
  args: TemplateBuilderArgs,
  context: { includeMultiplication?: boolean; includeDivision?: boolean },
): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const base = Math.max(4, scaleWithDifficulty(difficulty, 6, 40));
  const a = randomInt(rand, 2, base);
  const b = randomInt(rand, 1, Math.max(3, Math.round(base * 0.6)));
  const c = randomInt(rand, 1, Math.max(2, Math.round(base * 0.4)));
  const useMultiplication = context.includeMultiplication && rand() > 0.4;
  const useDivision = context.includeDivision && rand() > 0.6;

  if (useDivision) {
    const product = a * b;
    const divisor = Math.max(2, Math.min(a, b));
    const quotient = Math.round(product / divisor);
    return {
      prompt: `What is (${a} × ${b}) ÷ ${divisor}?`,
      answer: quotient.toString(),
      ...withExplanation([
        `Multiply ${a} by ${b} to get ${product}.`,
        `Divide ${product} by ${divisor} to reach ${quotient}.`,
      ]),
      options: buildMcqOptions(rand, quotient, difficulty),
    };
  }

  const choiceA = useMultiplication ? `${a} × ${b}` : `${a} + ${b}`;
  const answer = useMultiplication ? a * b + c : a + b + c;
  return {
    prompt: `Question ${args.index + 1}: What is ${choiceA} ${useMultiplication ? '+' : '+'} ${c}?`,
    answer: answer.toString(),
    ...withExplanation(
      useMultiplication
        ? [`Multiply ${a} by ${b} to get ${a * b}.`, `Add ${c} to get ${answer}.`]
        : [`Add ${a} and ${b} to make ${a + b}.`, `Add ${c} more to reach ${answer}.`],
    ),
    options: buildMcqOptions(rand, answer, difficulty),
  };
};

const buildPlaceValueQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const hundreds = randomInt(rand, 1, Math.max(2, Math.round(difficulty / 15) + 1));
  const tens = randomInt(rand, 0, 8);
  const ones = randomInt(rand, 0, 9);

  const compare = expandedCompare(rand, hundreds, tens, ones);
  return compare;
};

const expandedCompare = (rand: SeededRandom, hundreds: number, tens: number, ones: number) => {
  const otherHundreds = Math.max(1, hundreds - 1);
  const otherNumber = otherHundreds * 100 + (tens + 1) * 10 + ones;
  const firstNumber = hundreds * 100 + tens * 10 + ones;
  const greater = firstNumber > otherNumber ? firstNumber : otherNumber;
  const options = finalizeOptions(rand, greater.toString(), [
    firstNumber.toString(),
    otherNumber.toString(),
    (greater + 10).toString(),
  ]);
  const reasoning =
    firstNumber > otherNumber
      ? `${firstNumber} has the larger hundreds place compared to ${otherNumber}.`
      : `${otherNumber} has the larger hundreds place compared to ${firstNumber}.`;
  return {
    prompt: `Which number is greater: ${firstNumber} or ${otherNumber}?`,
    answer: greater.toString(),
    ...withExplanation([
      `Compare the hundreds digits: ${hundreds} vs ${otherHundreds}.`,
      reasoning,
    ]),
    options,
  };
};

const buildMeasurementQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const minMinutes = scaleWithDifficulty(difficulty, 10, 60);
  const maxMinutes = scaleWithDifficulty(difficulty, 20, 90);
  const minutes = randomInt(rand, minMinutes, Math.max(minMinutes, maxMinutes));
  const extra = randomInt(rand, 2, 12);
  const totalMinutes = minutes + extra;
  const options = finalizeOptions(rand, `${totalMinutes} minutes`, [
    `${totalMinutes + 5} minutes`,
    `${Math.max(1, totalMinutes - 5)} minutes`,
    `${minutes} minutes`,
  ]);

  return {
    prompt: `A lesson runs for ${minutes} minutes and then pauses for ${extra} minutes. How many minutes is that in total?`,
    answer: `${totalMinutes} minutes`,
    ...withExplanation([
      `Start with ${minutes} minutes of activity.`,
      `Add the ${extra}-minute pause for ${totalMinutes} minutes total.`,
    ]),
    options,
  };
};

const buildGeometryQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const base = Math.max(3, scaleWithDifficulty(difficulty, 4, 18));
  const height = randomInt(rand, 2, Math.max(6, Math.round(base * 0.8)));
  const area = (base * height) / 2;

  return {
    prompt: `What is the area of a triangle with base ${base} units and height ${height} units?`,
    answer: area.toString(),
    ...withExplanation([
      `Multiply base ${base} by height ${height} to get ${base * height}.`,
      `Divide by 2 to find the area ${area}.`,
    ]),
    options: buildMcqOptions(rand, area, difficulty),
  };
};

const buildFractionQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const numerator = randomInt(rand, 1, Math.max(3, Math.round(difficulty / 10) + 2));
  const denominator = randomInt(rand, numerator + 1, numerator + 6);
  const compareNumerator = numerator + 1;
  const correct = `${compareNumerator}/${denominator}`;
  const options = finalizeOptions(rand, correct, [
    `${numerator}/${denominator}`,
    `${numerator}/${denominator + 1}`,
    `${compareNumerator}/${denominator + 1}`,
  ]);
  return {
    prompt: `Which is greater: ${numerator}/${denominator} or ${compareNumerator}/${denominator}?`,
    answer: correct,
    ...withExplanation([
      `Both fractions have the same denominator ${denominator}.`,
      `Compare numerators: ${compareNumerator} is larger than ${numerator}.`,
      `${compareNumerator}/${denominator} is the greater fraction.`,
    ]),
    options,
  };
};

const buildRatioQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const partA = randomInt(rand, 2, Math.max(5, Math.round(difficulty / 6)));
  const partB = randomInt(rand, 3, Math.max(7, Math.round(difficulty / 4)));
  const scale = randomInt(rand, 2, 6);

  const missing = partA * scale;
  const answer = partB * scale;
  return {
    prompt: `If ${missing} units represent the first part of a ${partA}:${partB} ratio, how many units represent the second part?`,
    answer: answer.toString(),
    ...withExplanation([
      `The ratio starts as ${partA}:${partB}.`,
      `${missing} matches ${partA} scaled by ${scale}.`,
      `Multiply ${partB} by ${scale} to get ${answer} for the second part.`,
    ]),
    options: buildMcqOptions(rand, answer, difficulty),
  };
};

const buildNumberSystemQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const a = randomInt(rand, -Math.max(4, Math.round(difficulty / 5)), Math.max(5, Math.round(difficulty / 4)));
  const b = randomInt(rand, -Math.max(3, Math.round(difficulty / 6)), Math.max(6, Math.round(difficulty / 5)));
  const multiplier = randomInt(rand, 2, 5);
  const total = multiplier * (a + b);
  return {
    prompt: `Compute ${multiplier} × (${a} + ${b}).`,
    answer: total.toString(),
    ...withExplanation([
      `Add the numbers inside parentheses: ${a} + ${b} = ${a + b}.`,
      `Multiply the sum by ${multiplier} to get ${total}.`,
    ]),
    options: buildMcqOptions(rand, total, difficulty),
  };
};

const buildExpressionsQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const coefficient = randomInt(rand, 2, Math.max(4, Math.round(difficulty / 8) + 2));
  const constant = randomInt(rand, 1, Math.max(5, Math.round(difficulty / 6)));
  const solution = randomInt(rand, 1, Math.max(8, Math.round(difficulty / 4)));
  const rhs = coefficient * solution + constant;

  return {
    prompt: `Solve for x: ${coefficient}x + ${constant} = ${rhs}.`,
    answer: solution.toString(),
    ...withExplanation([
      `Subtract ${constant} from both sides to get ${coefficient}x = ${rhs - constant}.`,
      `Divide by ${coefficient} to find x = ${solution}.`,
    ]),
    options: buildMcqOptions(rand, solution, difficulty),
  };
};

const buildFunctionQuestion = (args: TemplateBuilderArgs, flavor: 'linear' | 'exponential'): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const slope = randomInt(rand, 1, Math.max(5, Math.round(difficulty / 8)));
  const intercept = randomInt(rand, -3, Math.max(6, Math.round(difficulty / 10)));
  const baseGrowth = randomInt(rand, 2, 4);
  const input = randomInt(rand, 2, 6);

  if (flavor === 'exponential') {
    const value = baseGrowth ** input;
    return {
      prompt: `Evaluate g(x) = ${baseGrowth}^x for x = ${input}.`,
      answer: value.toString(),
      ...withExplanation([
        `Use the base ${baseGrowth} and exponent ${input}.`,
        `Compute ${baseGrowth}^${input} to get ${value}.`,
      ]),
      options: buildMcqOptions(rand, value, difficulty),
    };
  }

  const value = slope * input + intercept;
  return {
    prompt: `For f(x) = ${slope}x + ${intercept}, what is f(${input})?`,
    answer: value.toString(),
    ...withExplanation([
      `Multiply ${input} by ${slope} to get ${slope * input}.`,
      `Add ${intercept} to reach ${value}.`,
    ]),
    options: buildMcqOptions(rand, value, difficulty),
  };
};

const buildTrigonometryQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const opposite = randomInt(rand, 3, Math.max(6, Math.round(difficulty / 6) + 3));
  const hypotenuse = Math.max(opposite + 1, randomInt(rand, opposite + 2, opposite + 8));
  const ratio = Math.round((opposite / hypotenuse) * 1000) / 1000;

  return {
    prompt: `Compute sin(θ) for a right triangle with opposite ${opposite} and hypotenuse ${hypotenuse}. Round to the nearest thousandth.`,
    answer: ratio.toString(),
    ...withExplanation([
      `Sine is opposite over hypotenuse: ${opposite}/${hypotenuse}.`,
      `Divide to get approximately ${ratio}.`,
    ]),
    options: buildMcqOptions(rand, ratio, difficulty),
  };
};

const buildStatisticsQuestion = (args: TemplateBuilderArgs, level: 'middle' | 'high'): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const samples = randomInt(rand, 15, Math.max(30, Math.round(difficulty + 15)));
  const mean = randomInt(rand, 50, 90);
  const margin = randomInt(rand, 2, 8);
  const probability = Math.round((margin / mean) * 1000) / 1000;

  return {
    prompt:
      level === 'high'
        ? `A survey of ${samples} students found a mean score of ${mean}. If ${margin} more students reach the target, what is the probability of success as a decimal?`
        : `If an event occurs ${margin} times out of ${mean}, what is its probability as a decimal?`,
    answer: probability.toString(),
    ...withExplanation([
      `Use ${margin} successes out of ${mean} total cases.`,
      `Divide ${margin} by ${mean} to estimate the probability ${probability}.`,
    ]),
    options: buildMcqOptions(rand, probability, difficulty),
  };
};

const buildGeometryHighQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty } = args;
  const radius = randomInt(rand, 3, Math.max(8, Math.round(difficulty / 4) + 3));
  const angle = randomInt(rand, 30, 120);
  const arcLength = Math.round(((angle / 360) * 2 * Math.PI * radius) * 100) / 100;
  const circumference = Math.round(2 * Math.PI * radius * 100) / 100;
  const circlePortion = Math.round((angle / 360) * 1000) / 1000;

  return {
    prompt: `Find the arc length for a central angle of ${angle}° in a circle with radius ${radius} (use π ≈ 3.14).`,
    answer: arcLength.toString(),
    ...withExplanation([
      `Circumference is 2πr ≈ ${circumference} when r = ${radius}.`,
      `Multiply ${circlePortion} of the circle by ${circumference} to get ${arcLength}.`,
    ]),
    options: buildMcqOptions(rand, arcLength, difficulty),
  };
};

const templateRegistry: TemplateDefinition[] = [
  {
    id: 'early-operations',
    name: 'Operations and algebraic thinking stories',
    ccssPatterns: ['1.OA.*', '2.OA.*'],
    gradeRange: [1, 2],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildArithmeticQuestion(args, { includeMultiplication: false, includeDivision: false }),
  },
  {
    id: 'place-value',
    name: 'Place value and comparison',
    ccssPatterns: ['1.NBT.*', '2.NBT.*', '3.NBT.*', '4.NBT.*', '5.NBT.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildPlaceValueQuestion(args),
  },
  {
    id: 'measurement-data',
    name: 'Measurement and data stories',
    ccssPatterns: ['1.MD.*', '2.MD.*', '3.MD.*', '4.MD.*', '5.MD.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildMeasurementQuestion(args),
  },
  {
    id: 'geometry-early',
    name: 'Elementary geometry reasoning',
    ccssPatterns: ['1.G.*', '2.G.*', '3.G.*', '4.G.*', '5.G.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildGeometryQuestion(args),
  },
  {
    id: 'upper-operations',
    name: 'Upper elementary operations',
    ccssPatterns: ['3.OA.*', '4.OA.*', '5.OA.*'],
    gradeRange: [3, 5],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildArithmeticQuestion(args, { includeMultiplication: true, includeDivision: true }),
  },
  {
    id: 'fractions',
    name: 'Fraction scaling and comparison',
    ccssPatterns: ['3.NF.*', '4.NF.*', '5.NF.*'],
    gradeRange: [3, 5],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildFractionQuestion(args),
  },
  {
    id: 'ratio-rate',
    name: 'Ratio and rate reasoning',
    ccssPatterns: ['6.RP.*', '7.RP.*'],
    gradeRange: [6, 7],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildRatioQuestion(args),
  },
  {
    id: 'number-system',
    name: 'Rational number operations',
    ccssPatterns: ['6.NS.*', '7.NS.*', '8.NS.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildNumberSystemQuestion(args),
  },
  {
    id: 'expressions-equations',
    name: 'Expressions and equations',
    ccssPatterns: ['6.EE.*', '7.EE.*', '8.EE.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'geometry-middle',
    name: 'Middle grades geometry and area',
    ccssPatterns: ['6.G.*', '7.G.*', '8.G.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildGeometryQuestion(args),
  },
  {
    id: 'functions-middle',
    name: 'Functions and rates of change',
    ccssPatterns: ['8.F.*'],
    gradeRange: [8, 8],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildFunctionQuestion(args, 'linear'),
  },
  {
    id: 'statistics-middle',
    name: 'Statistics and probability (middle)',
    ccssPatterns: ['6.SP.*', '7.SP.*', '8.SP.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildStatisticsQuestion(args, 'middle'),
  },
  {
    id: 'algebra-structure',
    name: 'Algebraic structure and reasoning',
    ccssPatterns: ['A-SSE.*', 'A-REI.*', 'A-CED.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'polynomials',
    name: 'Polynomial arithmetic',
    ccssPatterns: ['A-APR.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'functions-high',
    name: 'Functions and modeling',
    ccssPatterns: ['F-IF.*', 'F-LE.*', 'F-BF.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildFunctionQuestion(args, args.ccssCode.startsWith('F-LE') ? 'exponential' : 'linear'),
  },
  {
    id: 'trigonometry',
    name: 'Trigonometric relationships',
    ccssPatterns: ['F-TF.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildTrigonometryQuestion(args),
  },
  {
    id: 'statistics-high',
    name: 'Statistics and inference',
    ccssPatterns: ['S-ID.*', 'S-CP.*', 'S-IC.*', 'S-MD.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildStatisticsQuestion(args, 'high'),
  },
  {
    id: 'geometry-high',
    name: 'High school geometry',
    ccssPatterns: ['G-CO.*', 'G-SRT.*', 'G-C.*', 'G-GPE.*', 'G-GMD.*', 'G-MG.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    build: (args) => buildGeometryHighQuestion(args),
  },
];

const findTemplatesForCode = (ccssCode: string, grade: number, point: number) =>
  templateRegistry.filter(
    (template) =>
      grade >= template.gradeRange[0] &&
      grade <= template.gradeRange[1] &&
      template.points.includes(point) &&
      template.ccssPatterns.some((pattern) => matchesPattern(ccssCode, pattern)),
  );

export const describeAllowedCcssCodes = (grade: number, point: number) => {
  const gradeData = pacing[String(grade)];
  const pointData = gradeData?.[String(point)];
  const ccssCodes = pointData?.ccssCodes ?? [];
  const allowed = ccssCodes.filter((code) => findTemplatesForCode(code, grade, point).length > 0);
  return allowed;
};

const selectQuestionContent = (
  rand: SeededRandom,
  index: number,
  grade: number,
  point: number,
  difficulty: number,
  ccssCode: string,
  template: TemplateDefinition,
) => {
  const content = template.build({ rand, index, difficulty, grade, point, ccssCode });
  return content;
};

const buildOptionsForContent = (
  rand: SeededRandom,
  content: TemplateBuildResult,
  difficulty: number,
) => {
  if (content.options && content.options.length) {
    return finalizeOptions(rand, content.answer, content.options);
  }

  const numericAnswer = Number(content.answer);
  if (!Number.isNaN(numericAnswer)) {
    return buildMcqOptions(rand, numericAnswer, difficulty);
  }

  return buildTextFallbackOptions(rand, content.answer);
};

const buildQuestionSet = (
  grade: number,
  point: number,
  numberLimit: number,
  seed: string,
  count: number,
  startIndex = 0,
): GeneratedQuestionSet => {
  const gradeData = pacing[String(grade)];
  const pointData = gradeData?.[String(point)];
  const ccssCodes = pointData?.ccssCodes ?? [];
  if (!ccssCodes.length) {
    throw new Error(`No pacing data found for grade ${grade}, point ${point}`);
  }

  const codeTemplates = ccssCodes.reduce<Record<string, TemplateDefinition[]>>((acc, code) => {
    const templates = findTemplatesForCode(code, grade, point);
    if (templates.length) acc[code] = templates;
    return acc;
  }, {});

  const allowedCcssCodes = Object.keys(codeTemplates);
  if (!allowedCcssCodes.length) {
    throw new Error(`No templates available for grade ${grade}, point ${point}`);
  }

  const rand = createSeededRandom(seed);
  const difficulty = clampNumberLimit(numberLimit);
  const orderedCodes = shuffle(rand, allowedCcssCodes);

  const questions = Array.from({ length: count }, (_, index) => {
    const questionIndex = startIndex + index;
    const ccssCode = orderedCodes[questionIndex % orderedCodes.length];
    const templates = codeTemplates[ccssCode];
    const template = templates[Math.floor(rand() * templates.length)];
    const content = selectQuestionContent(rand, questionIndex, grade, point, difficulty, ccssCode, template);
    const options = buildOptionsForContent(rand, content, difficulty);
    const explanationSteps = normalizeExplanationSteps(content.explanationSteps, content.explanation);
    const explanation = createFriendlyExplanation(grade, explanationSteps, content.answer);

    return {
      id: questionIndex + 1,
      prompt: content.prompt,
      type: 'mcq' as QuestionType,
      answer: content.answer,
      explanation,
      explanationSteps,
      ccssCode,
      templateId: template.id,
      options,
      selectedChoice: null,
      isCorrect: null,
    };
  });

  return { questions, allowedCcssCodes };
};

export const generateQuestions = (
  grade: number,
  point: number,
  numberLimit: number,
  seed: string,
): GeneratedQuestionSet => buildQuestionSet(grade, point, numberLimit, seed, 15);

export const generateQuestion = (
  grade: number,
  point: number,
  numberLimit: number,
  seed: string,
  index: number,
): QuizQuestion => buildQuestionSet(grade, point, numberLimit, seed, 1, index).questions[0];

export const getTemplateById = (id: string) => templateRegistry.find((template) => template.id === id);

export const getTemplatesForCode = (ccssCode: string, grade: number, point: number) =>
  findTemplatesForCode(ccssCode, grade, point);
