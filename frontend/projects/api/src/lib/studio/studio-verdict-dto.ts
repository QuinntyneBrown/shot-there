import { RubricScoresDto } from './rubric-scores-dto';

export interface StudioVerdictDto {
  whoItsFor: string;
  whoShouldSkip: string;
  scores: RubricScoresDto;
  /** Mean of the six scores to one decimal, computed by the server. */
  overallScore: number;
}
