import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';
import type { StudioRecord } from '@/lib/studios/studio-record';

export function rubricScoresOf(studio: StudioRecord): RubricScoresDto {
  return {
    value: studio.scoreValue,
    light: studio.scoreLight,
    space: studio.scoreSpace,
    gear: studio.scoreGear,
    logistics: studio.scoreLogistics,
    condition: studio.scoreCondition,
  };
}
