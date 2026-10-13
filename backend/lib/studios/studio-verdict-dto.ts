import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';

export interface StudioVerdictDto {
  whoItsFor: string | null;
  whoShouldSkip: string | null;
  scores: RubricScoresDto;
  overallScore: number | null;
}
