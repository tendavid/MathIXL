const splitSentences = (text: string) =>
  text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const normalizeSteps = (steps: string[], maxCount = 5) =>
  steps
    .map((step) => step.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, maxCount);

const joinSentences = (sentences: string[], maxCount = 3) =>
  sentences.slice(0, maxCount).join(' ').trim();

const buildGradeFallback = (grade: number, answer?: string) => {
  if (grade <= 3) {
    return joinSentences(
      [
        'We solve it one small step at a time.',
        'Use the operation in the question carefully.',
        answer ? `That gives ${answer}.` : '',
      ].filter(Boolean),
    );
  }

  if (grade <= 6) {
    return joinSentences(
      [
        'Read what the problem is asking first.',
        'Do the operation in order and double-check.',
        answer ? `You end up with ${answer}.` : '',
      ].filter(Boolean),
    );
  }

  return joinSentences(
    [
      'Use the rule or formula that matches the question.',
      'Show the key steps and simplify.',
      answer ? `The result is ${answer}.` : '',
    ].filter(Boolean),
  );
};

export const buildExplanationFromSteps = (steps: string[]) =>
  normalizeSteps(steps).join(' ').trim();

export const createFriendlyExplanation = (
  grade: number,
  rawExplanation?: string | string[],
  answer?: string,
) => {
  const steps = Array.isArray(rawExplanation)
    ? normalizeSteps(rawExplanation)
    : normalizeSteps(splitSentences(rawExplanation ?? ''));
  if (steps.length) {
    return buildExplanationFromSteps(steps);
  }

  const friendly = buildGradeFallback(grade, answer);

  if (grade <= 3) {
    return joinSentences(['Think it through slowly.', friendly], 3);
  }

  if (grade <= 6) {
    return joinSentences(['Break the work into steps.', friendly], 3);
  }

  return joinSentences(['Reason it out clearly.', friendly], 3);
};

export const toChoiceLetter = (index: number) => String.fromCharCode(65 + index);

export const normalizeExplanationSteps = (steps: string[] | undefined, fallback?: string) => {
  const normalized = normalizeSteps(steps ?? []);
  if (normalized.length) return normalized;
  if (fallback) return normalizeSteps(splitSentences(fallback));
  return [] as string[];
};
