import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';

export interface StudioVerdictDto {
  whoItsFor: string;
  whoShouldSkip: string;
  scores: RubricScoresDto;
  /** One decimal place. */
  overallScore: number;
}
