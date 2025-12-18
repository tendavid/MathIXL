import pacingData from '../data/pacing.json' with { type: 'json' };
import { QuestionType, QuizQuestion } from '../types/quiz';

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
  type: QuestionType;
  grade: number;
  point: number;
  ccssCode: string;
};

type TemplateBuildResult = {
  prompt: string;
  answer: string;
  explanation: string;
  type: QuestionType;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  ccssPatterns: string[];
  gradeRange: [number, number];
  points: number[];
  types: QuestionType[];
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

const wordiness = (difficulty: number) => {
  if (difficulty >= 40) {
    return 'Give enough context in your reasoning to justify each calculation and connect the steps.';
  }
  if (difficulty >= 25) {
    return 'Show the steps clearly and mention why the values make sense for the situation.';
  }
  return 'Solve carefully and state the operation you used.';
};

const scaleWithDifficulty = (difficulty: number, min: number, max: number) => {
  const normalized = clampNumberLimit(difficulty) / 50;
  return Math.round(min + normalized * (max - min));
};

const buildMcqOptions = (rand: SeededRandom, answer: number, difficulty: number) => {
  const spread = Math.max(3, Math.round(difficulty / 4));
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = randomInt(rand, 1, spread);
    const direction = rand() > 0.5 ? 1 : -1;
    const distractor = Math.max(0, answer + offset * direction);
    options.add(distractor === answer ? distractor + 1 : distractor);
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

const pickType = (index: number, grade: number): QuestionType => {
  if (grade <= 2) {
    return ['mcq', 'numeric', 'mcq', 'text'][index % 4] as QuestionType;
  }
  if (grade <= 5) {
    return ['mcq', 'numeric', 'text'][index % 3] as QuestionType;
  }
  if (grade <= 8) {
    return ['numeric', 'mcq', 'text'][index % 3] as QuestionType;
  }
  return ['text', 'mcq', 'numeric'][index % 3] as QuestionType;
};

const buildArithmeticQuestion = (
  args: TemplateBuilderArgs,
  context: { includeMultiplication?: boolean; includeDivision?: boolean },
): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const base = Math.max(4, scaleWithDifficulty(difficulty, 6, 40));
  const a = randomInt(rand, 2, base);
  const b = randomInt(rand, 1, Math.max(3, Math.round(base * 0.6)));
  const c = randomInt(rand, 1, Math.max(2, Math.round(base * 0.4)));
  const detail = wordiness(difficulty);
  const useMultiplication = context.includeMultiplication && rand() > 0.4;
  const useDivision = context.includeDivision && rand() > 0.6;

  if (type === 'text') {
    const operationDescription = useMultiplication
      ? `multiply ${a} groups of ${b} and then add ${c} more`
      : `add ${a} and ${b} before adjusting by ${c}`;
    const answerText = useMultiplication ? `${a} × ${b} + ${c}` : `${a} + ${b} + ${c}`;
    return {
      prompt: `Describe how to solve a story problem that asks you to ${operationDescription}. ${detail}`,
      answer: `Compute ${answerText} to finish the problem.`,
      explanation:
        'State the operation order, explain why multiplication or addition fits the story, and conclude with the numeric total.',
      type,
    };
  }

  if (type === 'numeric') {
    if (useDivision) {
      const product = a * b;
      const divisor = Math.max(2, Math.min(a, b));
      const quotient = Math.round(product / divisor);
      return {
        prompt: `Evaluate (${a} × ${b}) ÷ ${divisor}.`,
        answer: quotient.toString(),
        explanation: `Multiply to get ${product} and then divide by ${divisor} for ${quotient}.`,
        type,
      };
    }
    if (useMultiplication) {
      const subtotal = a * b;
      const total = subtotal + c;
      return {
        prompt: `Compute ${a} × ${b} + ${c}.`,
        answer: total.toString(),
        explanation: `Multiply first (${a} × ${b} = ${subtotal}) then add ${c} to reach ${total}.`,
        type,
      };
    }
    const total = a + b + c;
    return {
      prompt: `Add ${a}, ${b}, and ${c}.`,
      answer: total.toString(),
      explanation: `Combine all three addends to confirm ${total}.`,
      type,
    };
  }

  const choiceA = useMultiplication ? `${a} × ${b}` : `${a} + ${b}`;
  const answer = useMultiplication ? a * b + c : a + b + c;
  return {
    prompt: `Question ${args.index + 1}: What is ${choiceA} ${useMultiplication ? '+' : '+'} ${c}?`,
    answer: answer.toString(),
    explanation: `Follow the operation order to find ${answer}.`,
    type,
  };
};

const buildPlaceValueQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const hundreds = randomInt(rand, 1, Math.max(2, Math.round(difficulty / 15) + 1));
  const tens = randomInt(rand, 0, 8);
  const ones = randomInt(rand, 0, 9);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Explain how to decompose the number ${hundreds}${tens}${ones} into hundreds, tens, and ones. ${detail}`,
      answer: `${hundreds} hundreds, ${tens} tens, and ${ones} ones.`,
      explanation: 'Break the number by place value to show how each digit contributes to the total.',
      type,
    };
  }

  if (type === 'numeric') {
    const expanded = hundreds * 100 + tens * 10 + ones;
    return {
      prompt: `Write ${expanded} in expanded form.`,
      answer: `${hundreds * 100} + ${tens * 10} + ${ones}`,
      explanation: 'Multiply each digit by its place value and join them with addition.',
      type,
    };
  }

  const compare = expandedCompare(hundreds, tens, ones);
  return compare;
};

const expandedCompare = (hundreds: number, tens: number, ones: number) => {
  const otherHundreds = Math.max(1, hundreds - 1);
  const otherNumber = otherHundreds * 100 + (tens + 1) * 10 + ones;
  const firstNumber = hundreds * 100 + tens * 10 + ones;
  const answer = firstNumber > otherNumber ? 'greater' : 'less';
  return {
    prompt: `Which is ${answer} and why: ${firstNumber} or ${otherNumber}?`,
    answer: `${firstNumber} is ${answer} because its hundreds digit is ${hundreds} versus ${otherHundreds}.`,
    explanation: 'Compare from the highest place value to the lowest to justify the decision.',
    type: 'mcq' as QuestionType,
  };
};

const buildMeasurementQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const minutes = scaleWithDifficulty(difficulty, 15, 90);
  const extra = randomInt(rand, 2, 12);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `A science activity lasts ${minutes} minutes and then pauses for another ${extra} minutes. Describe how to find the total elapsed time. ${detail}`,
      answer: `Add ${minutes} and ${extra} to get ${minutes + extra} minutes.`,
      explanation: 'Combine intervals and mention units when adding times.',
      type,
    };
  }

  if (type === 'numeric') {
    const lengthA = randomInt(rand, 4, Math.max(6, Math.round(minutes / 10)));
    const lengthB = randomInt(rand, 2, Math.max(4, Math.round(minutes / 12)));
    const total = lengthA + lengthB;
    return {
      prompt: `A ribbon is ${lengthA} cm long and another is ${lengthB} cm long. What is their combined length?`,
      answer: `${total} cm`,
      explanation: `Add the lengths since the pieces are placed end to end (${total} cm).`,
      type,
    };
  }

  return {
    prompt: 'Select the total duration if a lesson runs and then pauses as described.',
    answer: `${minutes + extra} minutes`,
    explanation: `The activity lasts ${minutes} minutes and the pause adds ${extra} more for ${minutes + extra}.`,
    type,
  };
};

const buildGeometryQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const side = Math.max(2, scaleWithDifficulty(difficulty, 3, 15));
  const height = randomInt(rand, 2, side + 4);
  const base = randomInt(rand, 3, side + 5);
  const area = (base * height) / 2;
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Explain how to find the area of a triangle with base ${base} units and height ${height} units. ${detail}`,
      answer: `Use A = 1/2 × base × height = 1/2 × ${base} × ${height} = ${area}.`,
      explanation: 'Substitute the given base and height into the triangle area formula and simplify.',
      type,
    };
  }

  if (type === 'numeric') {
    const perimeter = 2 * side + base;
    return {
      prompt: `A triangle has two sides of length ${side} units and a base of ${base} units. What is its perimeter?`,
      answer: perimeter.toString(),
      explanation: `Add all three side lengths: ${side} + ${side} + ${base} = ${perimeter}.`,
      type,
    };
  }

  const shape =
    rand() > 0.5 ? `a rectangle of side ${side}` : `a triangle with base ${base} and height ${height}`;
  const key = shape.includes('rectangle')
    ? `Multiply side lengths`
    : `Multiply base and height then halve`;
  return {
    prompt: `Which method finds the area of ${shape}?`,
    answer: `${key}`,
    explanation: 'Area formulas depend on the shape: rectangles use side products, triangles use one-half base times height.',
    type,
  };
};

const buildFractionQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const numerator = randomInt(rand, 1, Math.max(3, Math.round(difficulty / 10) + 2));
  const denominator = randomInt(rand, numerator + 1, numerator + 6);
  const scale = randomInt(rand, 2, 5);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Describe how to find ${scale} times the fraction ${numerator}/${denominator}. ${detail}`,
      answer: `Multiply the numerator by ${scale} to get ${(numerator * scale)}/${denominator}.`,
      explanation: 'Scaling a fraction multiplies the numerator by the whole-number factor while keeping the denominator.',
      type,
    };
  }

  if (type === 'numeric') {
    const mixedWhole = randomInt(rand, 1, 3);
    const improperNumerator = mixedWhole * denominator + numerator;
    return {
      prompt: `Convert ${mixedWhole} ${numerator}/${denominator} to an improper fraction.`,
      answer: `${improperNumerator}/${denominator}`,
      explanation: `Multiply the whole number by the denominator (${mixedWhole} × ${denominator}) and add the numerator.`,
      type,
    };
  }

  const compareNumerator = numerator + 1;
  return {
    prompt: `Which is greater: ${numerator}/${denominator} or ${compareNumerator}/${denominator}?`,
    answer: `${compareNumerator}/${denominator}`,
    explanation: 'With a common denominator, the larger numerator makes the fraction greater.',
    type,
  };
};

const buildRatioQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const partA = randomInt(rand, 2, Math.max(5, Math.round(difficulty / 6)));
  const partB = randomInt(rand, 3, Math.max(7, Math.round(difficulty / 4)));
  const scale = randomInt(rand, 2, 6);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `A recipe mixes ingredients in a ${partA}:${partB} ratio. Explain how many parts of each are needed for ${scale} batches. ${detail}`,
      answer: `Multiply both parts by ${scale} to get ${partA * scale}:${partB * scale}.`,
      explanation: 'Scaling ratios multiplies each part by the same factor to keep the relationship.',
      type,
    };
  }

  if (type === 'numeric') {
    const total = partA + partB;
    const partAPercent = Math.round((partA / total) * 100);
    return {
      prompt: `In a group with ratio ${partA}:${partB}, what percent is the first quantity? Round to the nearest whole percent.`,
      answer: `${partAPercent}%`,
      explanation: `Divide ${partA} by the total ${total} and convert to a percent.`,
      type,
    };
  }

  const missing = partA * scale;
  return {
    prompt: `If ${missing} units represent the first part of a ${partA}:${partB} ratio, how many units represent the second part?`,
    answer: (partB * scale).toString(),
    explanation: `Use the same scale factor ${scale} on the second part (${partB} × ${scale}).`,
    type,
  };
};

const buildNumberSystemQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const a = randomInt(rand, -Math.max(4, Math.round(difficulty / 5)), Math.max(5, Math.round(difficulty / 4)));
  const b = randomInt(rand, -Math.max(3, Math.round(difficulty / 6)), Math.max(6, Math.round(difficulty / 5)));
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Explain how to add the integers ${a} and ${b}. ${detail}`,
      answer: `Combine signs: ${a} + ${b} = ${a + b}.`,
      explanation: 'Show how to handle adding numbers with possibly different signs using a number line or absolute values.',
      type,
    };
  }

  if (type === 'numeric') {
    const multiplier = randomInt(rand, 2, 5);
    return {
      prompt: `Compute ${multiplier} × (${a} + ${b}).`,
      answer: (multiplier * (a + b)).toString(),
      explanation: `Add inside the parentheses first (${a + b}) then multiply by ${multiplier}.`,
      type,
    };
  }

  const rationalA = `${a}/${randomInt(rand, 2, 9)}`;
  const rationalB = `${b}/${randomInt(rand, 2, 9)}`;
  return {
    prompt: `Which rational number is greater: ${rationalA} or ${rationalB}?`,
    answer: `${rationalA} is greater if its value is closer to zero when both are negative, otherwise compare their decimal approximations.`,
    explanation: 'Convert both to decimals or compare cross-products when denominators differ.',
    type,
  };
};

const buildExpressionsQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const coefficient = randomInt(rand, 2, Math.max(4, Math.round(difficulty / 8) + 2));
  const constant = randomInt(rand, 1, Math.max(5, Math.round(difficulty / 6)));
  const solution = randomInt(rand, 1, Math.max(8, Math.round(difficulty / 4)));
  const rhs = coefficient * solution + constant;
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Solve ${coefficient}x + ${constant} = ${rhs} and justify each algebraic step. ${detail}`,
      answer: `Subtract ${constant} from both sides and divide by ${coefficient} to get x = ${solution}.`,
      explanation: 'Undo addition/subtraction first, then undo multiplication/division to isolate the variable.',
      type,
    };
  }

  if (type === 'numeric') {
    const exponent = randomInt(rand, 2, 4);
    return {
      prompt: `Evaluate ${coefficient}x^${exponent} when x = ${solution}.`,
      answer: (coefficient * solution ** exponent).toString(),
      explanation: `Compute the power first (${solution}^${exponent}) then multiply by ${coefficient}.`,
      type,
    };
  }

  const inequalityRight = rhs + randomInt(rand, 1, 5);
  return {
    prompt: `Which solution set fits ${coefficient}x + ${constant} < ${inequalityRight}?`,
    answer: `x < ${(inequalityRight - constant) / coefficient}`,
    explanation: 'Isolate x using the same inverse operations while keeping the inequality direction.',
    type,
  };
};

const buildFunctionQuestion = (args: TemplateBuilderArgs, flavor: 'linear' | 'exponential'): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const slope = randomInt(rand, 1, Math.max(5, Math.round(difficulty / 8)));
  const intercept = randomInt(rand, -3, Math.max(6, Math.round(difficulty / 10)));
  const baseGrowth = randomInt(rand, 2, 4);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    if (flavor === 'exponential') {
      return {
        prompt: `A population triples every year starting at ${baseGrowth * 10} organisms. Explain how to model this with a function. ${detail}`,
        answer: `Use P(t) = ${baseGrowth * 10} · ${baseGrowth}^t to show repeated multiplication.`,
        explanation: 'State the initial value and the constant growth factor and explain why exponents represent repeated growth.',
        type,
      };
    }
    return {
      prompt: `Describe what the slope ${slope} means in the linear function f(x) = ${slope}x + ${intercept}. ${detail}`,
      answer: `Each 1-unit increase in x changes f(x) by ${slope}; ${intercept} is the starting value.`,
      explanation: 'Connect the rate of change and y-intercept to a context like savings or motion.',
      type,
    };
  }

  if (type === 'numeric') {
    const input = randomInt(rand, 2, 6);
    if (flavor === 'exponential') {
      return {
        prompt: `Evaluate g(x) = ${baseGrowth}^x for x = ${input}.`,
        answer: (baseGrowth ** input).toString(),
        explanation: `Compute repeated multiplication of ${baseGrowth} for ${input} times.`,
        type,
      };
    }
    return {
      prompt: `For f(x) = ${slope}x + ${intercept}, what is f(${input})?`,
      answer: (slope * input + intercept).toString(),
      explanation: `Multiply ${input} by ${slope} and add ${intercept}.`,
      type,
    };
  }

  const interpretation =
    flavor === 'exponential'
      ? 'doubling/halving represents multiplicative change'
      : 'slope represents additive rate of change';
  return {
    prompt: `Which statement best describes the function's rate of change?`,
    answer: `The ${interpretation}.`,
    explanation: 'Identify whether the function grows by constant differences (linear) or factors (exponential).',
    type,
  };
};

const buildTrigonometryQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const opposite = randomInt(rand, 3, Math.max(6, Math.round(difficulty / 6) + 3));
  const hypotenuse = Math.max(opposite + 1, randomInt(rand, opposite + 2, opposite + 8));
  const angleDegrees = Math.round((Math.asin(opposite / hypotenuse) * 180) / Math.PI);
  const adjacent = Math.round(Math.sqrt(Math.max(hypotenuse ** 2 - opposite ** 2, 1)));
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `In a right triangle with hypotenuse ${hypotenuse} and opposite side ${opposite}, explain how to find the acute angle across from the opposite side. ${detail}`,
      answer: `Use sin θ = opposite / hypotenuse = ${opposite}/${hypotenuse}, so θ ≈ ${angleDegrees}°.`,
      explanation:
        `Identify the sides relative to the angle, note the adjacent side is about ${adjacent} by the Pythagorean theorem, choose the sine ratio, and use inverse sine to approximate the angle.`,
      type,
    };
  }

  if (type === 'numeric') {
    const ratio = Math.round((opposite / hypotenuse) * 1000) / 1000;
    return {
      prompt: `Compute sin(θ) for a right triangle with opposite ${opposite} and hypotenuse ${hypotenuse}. Round to the nearest thousandth.`,
      answer: ratio.toString(),
      explanation: `Sine is opposite over hypotenuse: ${opposite}/${hypotenuse} ≈ ${ratio}.`,
      type,
    };
  }

  return {
    prompt: 'Which trigonometric ratio compares the adjacent side to the hypotenuse in a right triangle?',
    answer: 'cosine',
    explanation: 'Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, and tangent is opposite over adjacent.',
    type,
  };
};

const buildStatisticsQuestion = (args: TemplateBuilderArgs, level: 'middle' | 'high'): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const samples = randomInt(rand, 15, Math.max(30, Math.round(difficulty + 15)));
  const mean = randomInt(rand, 50, 90);
  const margin = randomInt(rand, 2, 8);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    if (level === 'high') {
      return {
        prompt: `A survey of ${samples} students found a mean score of ${mean}. Describe how to report a margin of error of ±${margin}. ${detail}`,
        answer: `Report the interval from ${mean - margin} to ${mean + margin} as the plausible range for the population mean.`,
        explanation: 'Tie the interval to sampling variability and the stated margin of error.',
        type,
      };
    }
    return {
      prompt: `Explain how a larger sample of ${samples} affects the reliability of the mean ${mean}. ${detail}`,
      answer: 'More data typically reduces variability, making the mean more reliable.',
      explanation: 'Connect sample size to stability of center and spread.',
      type,
    };
  }

  if (type === 'numeric') {
    const probability = Math.round((margin / mean) * 1000) / 1000;
    return {
      prompt: `If an event occurs ${margin} times out of ${mean}, what is its probability as a decimal?`,
      answer: probability.toString(),
      explanation: `Divide successes (${margin}) by trials (${mean}) to estimate probability.`,
      type,
    };
  }

  const statement =
    level === 'high'
      ? 'A confidence interval describes plausible population parameters.'
      : 'A dot plot can show clusters, gaps, and peaks in data.';
  return {
    prompt: 'Select the most accurate statistical statement.',
    answer: statement,
    explanation: 'Relate the statement to the focus of the selected CCSS statistics strand.',
    type,
  };
};

const buildGeometryHighQuestion = (args: TemplateBuilderArgs): TemplateBuildResult => {
  const { rand, difficulty, type } = args;
  const radius = randomInt(rand, 3, Math.max(8, Math.round(difficulty / 4) + 3));
  const angle = randomInt(rand, 30, 120);
  const scale = randomInt(rand, 2, 5);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Describe how to find the arc length for a central angle of ${angle}° in a circle with radius ${radius}. ${detail}`,
      answer: `Use (angle/360) × 2πr = (${angle}/360) × 2π(${radius}).`,
      explanation: 'Relate the proportion of the circle to the full circumference.',
      type,
    };
  }

  if (type === 'numeric') {
    const volume = (4 / 3) * Math.PI * radius ** 3;
    return {
      prompt: `Approximate the volume of a sphere with radius ${radius} (use π ≈ 3.14).`,
      answer: (Math.round(volume * 100) / 100).toString(),
      explanation: `Apply V = 4/3 πr³ with r = ${radius}.`,
      type,
    };
  }

  return {
    prompt: `A dilation with scale factor ${scale} is applied to a triangle. How does its area change?`,
    answer: `Area is multiplied by ${scale ** 2} because both dimensions scale by ${scale}.`,
    explanation: 'Scaling lengths by k scales area by k².',
    type,
  };
};

const templateRegistry: TemplateDefinition[] = [
  {
    id: 'early-operations',
    name: 'Operations and algebraic thinking stories',
    ccssPatterns: ['1.OA.*', '2.OA.*'],
    gradeRange: [1, 2],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildArithmeticQuestion(args, { includeMultiplication: false, includeDivision: false }),
  },
  {
    id: 'place-value',
    name: 'Place value and comparison',
    ccssPatterns: ['1.NBT.*', '2.NBT.*', '3.NBT.*', '4.NBT.*', '5.NBT.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildPlaceValueQuestion(args),
  },
  {
    id: 'measurement-data',
    name: 'Measurement and data stories',
    ccssPatterns: ['1.MD.*', '2.MD.*', '3.MD.*', '4.MD.*', '5.MD.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildMeasurementQuestion(args),
  },
  {
    id: 'geometry-early',
    name: 'Elementary geometry reasoning',
    ccssPatterns: ['1.G.*', '2.G.*', '3.G.*', '4.G.*', '5.G.*'],
    gradeRange: [1, 5],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildGeometryQuestion(args),
  },
  {
    id: 'upper-operations',
    name: 'Upper elementary operations',
    ccssPatterns: ['3.OA.*', '4.OA.*', '5.OA.*'],
    gradeRange: [3, 5],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildArithmeticQuestion(args, { includeMultiplication: true, includeDivision: true }),
  },
  {
    id: 'fractions',
    name: 'Fraction scaling and comparison',
    ccssPatterns: ['3.NF.*', '4.NF.*', '5.NF.*'],
    gradeRange: [3, 5],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildFractionQuestion(args),
  },
  {
    id: 'ratio-rate',
    name: 'Ratio and rate reasoning',
    ccssPatterns: ['6.RP.*', '7.RP.*'],
    gradeRange: [6, 7],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildRatioQuestion(args),
  },
  {
    id: 'number-system',
    name: 'Rational number operations',
    ccssPatterns: ['6.NS.*', '7.NS.*', '8.NS.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildNumberSystemQuestion(args),
  },
  {
    id: 'expressions-equations',
    name: 'Expressions and equations',
    ccssPatterns: ['6.EE.*', '7.EE.*', '8.EE.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'geometry-middle',
    name: 'Middle grades geometry and area',
    ccssPatterns: ['6.G.*', '7.G.*', '8.G.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildGeometryQuestion(args),
  },
  {
    id: 'functions-middle',
    name: 'Functions and rates of change',
    ccssPatterns: ['8.F.*'],
    gradeRange: [8, 8],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildFunctionQuestion(args, 'linear'),
  },
  {
    id: 'statistics-middle',
    name: 'Statistics and probability (middle)',
    ccssPatterns: ['6.SP.*', '7.SP.*', '8.SP.*'],
    gradeRange: [6, 8],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildStatisticsQuestion(args, 'middle'),
  },
  {
    id: 'algebra-structure',
    name: 'Algebraic structure and reasoning',
    ccssPatterns: ['A-SSE.*', 'A-REI.*', 'A-CED.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'polynomials',
    name: 'Polynomial arithmetic',
    ccssPatterns: ['A-APR.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildExpressionsQuestion(args),
  },
  {
    id: 'functions-high',
    name: 'Functions and modeling',
    ccssPatterns: ['F-IF.*', 'F-LE.*', 'F-BF.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildFunctionQuestion(args, args.ccssCode.startsWith('F-LE') ? 'exponential' : 'linear'),
  },
  {
    id: 'trigonometry',
    name: 'Trigonometric relationships',
    ccssPatterns: ['F-TF.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildTrigonometryQuestion(args),
  },
  {
    id: 'statistics-high',
    name: 'Statistics and inference',
    ccssPatterns: ['S-ID.*', 'S-CP.*', 'S-IC.*', 'S-MD.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
    build: (args) => buildStatisticsQuestion(args, 'high'),
  },
  {
    id: 'geometry-high',
    name: 'High school geometry',
    ccssPatterns: ['G-CO.*', 'G-SRT.*', 'G-C.*', 'G-GPE.*', 'G-GMD.*', 'G-MG.*'],
    gradeRange: [9, 12],
    points: [1, 2, 3, 4, 5],
    types: ['mcq', 'numeric', 'text'],
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
  const desiredType = pickType(index, grade);
  const type = template.types.includes(desiredType)
    ? desiredType
    : template.types[Math.floor(rand() * template.types.length)];
  const content = template.build({ rand, index, difficulty, type, grade, point, ccssCode });
  return content;
};

export const generateQuestions = (
  grade: number,
  point: number,
  numberLimit: number,
  seed: string,
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

  const questions = Array.from({ length: 15 }, (_, index) => {
    const ccssCode = orderedCodes[index % orderedCodes.length];
    const templates = codeTemplates[ccssCode];
    const template = templates[Math.floor(rand() * templates.length)];
    const content = selectQuestionContent(rand, index, grade, point, difficulty, ccssCode, template);
    const numericAnswer = Number(content.answer);
    const isNumeric = !Number.isNaN(numericAnswer);
    const options =
      content.type === 'mcq' && isNumeric
        ? buildMcqOptions(rand, numericAnswer, difficulty)
        : content.type === 'mcq'
          ? shuffle(rand, [
              content.answer,
              `${content.answer} (checked)`,
              `${content.answer} but with a common mistake`,
              'None of these',
            ])
          : [];

    return {
      id: index + 1,
      prompt: content.prompt,
      type: content.type,
      answer: content.answer,
      explanation: content.explanation,
      ccssCode,
      templateId: template.id,
      options,
      selectedIndex: null,
      response: null,
    };
  });

  return { questions, allowedCcssCodes };
};

export const getTemplateById = (id: string) => templateRegistry.find((template) => template.id === id);

export const getTemplatesForCode = (ccssCode: string, grade: number, point: number) =>
  findTemplatesForCode(ccssCode, grade, point);
