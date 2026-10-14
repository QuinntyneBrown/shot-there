import type { RubricScoresInput } from '@/lib/studios/rubric-scores-input';
import type { StudioRecord } from '@/lib/studios/studio-record';

export function rubricScoresOf(studio: StudioRecord): RubricScoresInput {
  return {
    value: studio.scoreValue,
    light: studio.scoreLight,
    space: studio.scoreSpace,
    gear: studio.scoreGear,
    logistics: studio.scoreLogistics,
    condition: studio.scoreCondition,
  };
}
