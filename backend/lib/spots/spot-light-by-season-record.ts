import type { Season } from '@/lib/spots/season';

export interface SpotLightBySeasonRecord {
  season: Season;
  note: string | null;
}
