import type { LightRating } from '@/lib/studios/light-rating';
import type { TimeOfDay } from '@/lib/spots/time-of-day';

export interface SpotLightByTimeRecord {
  timeOfDay: TimeOfDay;
  rating: LightRating;
  note: string | null;
}
