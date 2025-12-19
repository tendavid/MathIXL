import pacingData from '../data/pacing.json';

type PacingPoint = {
  title: string;
  ccssCodes: string[];
  masteryText: string;
  quizGuidanceText: string;
  sampleItems?: string[];
};

type PacingData = Record<string, Record<string, PacingPoint>>;

const pacing = pacingData as PacingData;

const fallbackLabels = {
  1: 'Number Sense',
  2: 'Operations',
  3: 'Fractions',
  4: 'Decimals',
  5: 'Word Problems',
};

export const getProgressionLabel = (grade: number, point: number) => {
  const gradeData = pacing[String(grade)];
  const pointData = gradeData?.[String(point)];

  if (pointData?.title) {
    return pointData.title;
  }

  return fallbackLabels[point as keyof typeof fallbackLabels] ?? `Progression ${point}`;
};
