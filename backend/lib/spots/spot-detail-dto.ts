import type { SpotLightBySeasonRecord } from '@/lib/spots/spot-light-by-season-record';
import type { SpotLightByTimeRecord } from '@/lib/spots/spot-light-by-time-record';
import type { SpotSampleShotDto } from '@/lib/spots/spot-sample-shot-dto';

/** The public spot page contract returned by `GET /api/spots/{slug}`. */
export interface SpotDetailDto {
  slug: string;
  name: string;
  neighbourhood: string | null;
  latitude: number | null;
  longitude: number | null;
  directions: string | null;
  lightByTime: SpotLightByTimeRecord[];
  lightBySeason: SpotLightBySeasonRecord[];
  sampleShots: SpotSampleShotDto[];
}
