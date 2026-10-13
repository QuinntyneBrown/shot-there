import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';

/** Mean of the six rubric scores rounded half up to one decimal, or null while any score is missing. */
export function computeOverallScore(scores: RubricScoresDto): number | null {
  const values = Object.values(scores);
  if (values.some((score) => score === null)) return null;
  const sum = (values as number[]).reduce((total, score) => total + score, 0);
  return Math.round((sum * 10) / values.length) / 10;
}
