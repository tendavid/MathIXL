import pacingData from '../data/pacing.json' with { type: 'json' };
import { QuestionType, QuizQuestion } from '../types/quiz';

type PacingPoint = {
  ccssCodes: string[];
};

type PacingData = Record<string, Record<string, PacingPoint>>;

const pacing = pacingData as PacingData;

type SeededRandom = () => number;

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

const buildPrimaryQuestion = (
  rand: SeededRandom,
  index: number,
  difficulty: number,
  type: QuestionType,
) => {
  const upper = Math.max(10, Math.round(difficulty * 1.2) + 5);
  const a = randomInt(rand, 3, upper);
  const b = randomInt(rand, 1, Math.max(3, Math.round(upper * 0.6)));
  const c = randomInt(rand, 1, Math.max(2, Math.round(upper * 0.4)));
  const useSubtraction = rand() > 0.45 && a > b;
  const baseContext =
    'A box of classroom supplies has markers and pencils that students are sorting carefully.';

  if (type === 'text') {
    const total = a + b;
    return {
      prompt: `${baseContext} Describe how you would find the total number of items if there are ${a} markers and ${b} pencils. ${wordiness(
        difficulty,
      )}`,
      answer: `Add the two amounts: ${a} + ${b} = ${total}.`,
      explanation:
        'Show that combining the two groups is addition. Mention counting on or drawing quick pictures to keep track of the quantities.',
      type,
    };
  }

  if (type === 'numeric') {
    const firstStep = a + b;
    const total = firstStep + c;
    return {
      prompt: `There are ${a} red beads and ${b} blue beads. ${c} more beads are added later. How many beads are there altogether? Include the steps in your head if possible.`,
      answer: total.toString(),
      explanation: `Add the first two counts (${a} + ${b} = ${firstStep}) and then add ${c} more to get ${total}.`,
      type,
    };
  }

  const expression = useSubtraction
    ? `What is ${a + b} - ${b}?`
    : `What is ${a} + ${b + c}?`;
  const answer = useSubtraction ? a : a + b + c;
  return {
    prompt: `Question ${index + 1}: ${expression} Think through the story before choosing your answer.`,
    answer: answer.toString(),
    explanation: `Either remove ${b} from ${a + b} or add ${a} to ${b + c}. Both approaches lead to ${answer}.`,
    type,
  };
};

const buildUpperElementaryQuestion = (
  rand: SeededRandom,
  index: number,
  difficulty: number,
  type: QuestionType,
) => {
  const base = Math.max(8, Math.round(difficulty * 1.4));
  const a = randomInt(rand, base, base + 10);
  const b = randomInt(rand, 3, Math.max(6, Math.round(base * 0.6)));
  const c = randomInt(rand, 2, Math.max(5, Math.round(base * 0.4)));
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `A student is planning a school carnival and orders ${a} tickets in each booklet. Explain how to find the total number of tickets if ${b} booklets are ordered and ${c} extra tickets are printed just in case. ${detail}`,
      answer: `Multiply ${a} by ${b} to get ${a * b} tickets from booklets, then add ${c} more.`,
      explanation:
        'Show multiplication as repeated equal groups, then include the leftover tickets as an addition step. Mention the reason for the extra tickets.',
      type,
    };
  }

  if (type === 'numeric') {
    const subtotal = a * b;
    const total = subtotal - c;
    return {
      prompt: `Compute ${a} × ${b} − ${c}. Think about which operation comes first and why.`,
      answer: total.toString(),
      explanation: `Multiply first to get ${subtotal}, then subtract ${c} to finish with ${total}.`,
      type,
    };
  }

  const sum = a + b + c;
  return {
    prompt: `Question ${index + 1}: A science club is counting collected samples. They log ${a} leaf samples, ${b} soil samples, and ${c} water samples. How many samples did they collect in all?`,
    answer: sum.toString(),
    explanation: `Add all three categories (${a} + ${b} + ${c}) to confirm the total of ${sum}.`,
    type,
  };
};

const buildMiddleSchoolQuestion = (
  rand: SeededRandom,
  index: number,
  difficulty: number,
  type: QuestionType,
) => {
  const base = Math.max(10, Math.round(difficulty * 1.6));
  const numerator = randomInt(rand, 2, Math.max(5, Math.round(base / 4)));
  const denominator = randomInt(rand, numerator + 1, numerator + 8);
  const scale = randomInt(rand, 2, Math.max(5, Math.round(difficulty / 10)));
  const percent = randomInt(rand, 5, 40);
  const detail = wordiness(difficulty);

  if (type === 'text') {
    const fraction = `${numerator}/${denominator}`;
    return {
      prompt: `A recipe uses ${fraction} cup of oil for each batch. Describe how many cups are needed for ${scale} batches and explain why your method works. ${detail}`,
      answer: `Multiply ${fraction} by ${scale} to get ${(numerator * scale)}/${denominator}.`,
      explanation:
        'Scale the fraction by the number of batches, keeping the denominator the same because each batch is the same size. Simplify if possible.',
      type,
    };
  }

  if (type === 'numeric') {
    const whole = randomInt(rand, base, base + 12);
    const increase = Math.round((percent / 100) * whole * 10) / 10;
    const newTotal = Math.round((whole + increase) * 10) / 10;
    return {
      prompt: `A class of ${whole} students grows by ${percent}% after new enrollments. What is the new class size? Round to the nearest tenth if needed.`,
      answer: newTotal.toString(),
      explanation: `Find ${percent}% of ${whole} (${increase}) and add it to the original amount to reach ${newTotal}.`,
      type,
    };
  }

  const start = randomInt(rand, base, base + 10);
  const rate = randomInt(rand, 2, 8);
  const steps = randomInt(rand, 2, 4);
  const final = start + rate * steps;
  return {
    prompt: `Question ${index + 1}: A sequence starts at ${start} and increases by ${rate} each step. What is the value after ${steps} more steps?`,
    answer: final.toString(),
    explanation: `Add the constant rate ${steps} times (${rate} × ${steps} = ${
      rate * steps
    }) and combine with the starting value for ${final}.`,
    type,
  };
};

const buildHighSchoolQuestion = (
  rand: SeededRandom,
  index: number,
  difficulty: number,
  type: QuestionType,
) => {
  const coefficient = randomInt(rand, 2, 8);
  const constant = randomInt(rand, 1, 16);
  const solution = randomInt(rand, 1, Math.max(8, Math.round(difficulty / 2)));
  const rhs = coefficient * solution + constant;
  const detail = wordiness(difficulty);

  if (type === 'text') {
    return {
      prompt: `Solve the linear equation ${coefficient}x + ${constant} = ${rhs} and describe each algebraic move you make. ${detail}`,
      answer: `Subtract ${constant} from both sides and divide by ${coefficient} to get x = ${solution}.`,
      explanation:
        'Undo addition or subtraction first, then undo multiplication by dividing both sides. State the inverse operations to justify isolating x.',
      type,
    };
  }

  if (type === 'numeric') {
    const slope = randomInt(rand, 2, 9);
    const run = randomInt(rand, 3, 10);
    const rise = slope * run;
    return {
      prompt: `A line rises ${rise} units for every ${run} units it runs. What is the slope of the line as a simplified fraction?`,
      answer: `${rise}/${run}`,
      explanation: `Slope is rise over run. Substitute the values to get ${rise}/${run} and reduce if there is a common factor.`,
      type,
    };
  }

  const legA = randomInt(rand, Math.max(6, difficulty), Math.max(10, difficulty + 6));
  const legB = randomInt(rand, Math.max(5, difficulty - 2), Math.max(9, difficulty + 4));
  const hypotenuse = Math.round(Math.hypot(legA, legB) * 10) / 10;
  return {
    prompt: `Question ${index + 1}: A right triangle has legs measuring ${legA} and ${legB} units. What is the length of the hypotenuse? Include the unit in your thinking.`,
    answer: hypotenuse.toString(),
    explanation: `Use the Pythagorean theorem: √(${legA}² + ${legB}²) ≈ ${hypotenuse}. Show the squared sums before taking the square root.`,
    type,
  };
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

const buildQuestionForGrade = (
  rand: SeededRandom,
  grade: number,
  index: number,
  difficulty: number,
  type: QuestionType,
) => {
  if (grade <= 2) return buildPrimaryQuestion(rand, index, difficulty, type);
  if (grade <= 5) return buildUpperElementaryQuestion(rand, index, difficulty, type);
  if (grade <= 8) return buildMiddleSchoolQuestion(rand, index, difficulty, type);
  return buildHighSchoolQuestion(rand, index, difficulty, type);
};

export const generateQuestions = (
  grade: number,
  point: number,
  numberLimit: number,
  seed: string,
): QuizQuestion[] => {
  const gradeData = pacing[String(grade)];
  const pointData = gradeData?.[String(point)];
  const ccssCodes = pointData?.ccssCodes ?? [];
  if (!ccssCodes.length) {
    throw new Error(`No pacing data found for grade ${grade}, point ${point}`);
  }

  const rand = createSeededRandom(seed);
  const difficulty = clampNumberLimit(numberLimit);

  return Array.from({ length: 15 }, (_, index) => {
    const type = pickType(index, grade);
    const content = buildQuestionForGrade(rand, grade, index, difficulty, type);
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
    const selectedIndex = null;

    return {
      id: index + 1,
      prompt: content.prompt,
      type: content.type,
      answer: content.answer,
      explanation: content.explanation,
      ccssCode: ccssCodes[index % ccssCodes.length],
      options,
      selectedIndex,
      response: null,
    };
  });
};
