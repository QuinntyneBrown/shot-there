import { present } from '@/lib/shared/present';
import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioRecord } from '@/lib/studios/studio-record';

export function toRubricScoresDto(studio: StudioRecord): RubricScoresDto {
  const scores = rubricScoresOf(studio);
  return {
    value: present(scores.value, 'scores.value'),
    light: present(scores.light, 'scores.light'),
    space: present(scores.space, 'scores.space'),
    gear: present(scores.gear, 'scores.gear'),
    logistics: present(scores.logistics, 'scores.logistics'),
    condition: present(scores.condition, 'scores.condition'),
  };
}
