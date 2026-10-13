import type { DisclosureDto } from '@/lib/publishing/disclosure-dto';
import type { BestUse } from '@/lib/spots/best-use';
import type { SpotConditionsDto } from '@/lib/spots/spot-conditions-dto';
import type { SpotLightBySeasonRecord } from '@/lib/spots/spot-light-by-season-record';
import type { SpotLightByTimeRecord } from '@/lib/spots/spot-light-by-time-record';
import type { SpotPermitsDto } from '@/lib/spots/spot-permits-dto';
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
  conditions: SpotConditionsDto;
  permits: SpotPermitsDto;
  bestUses: BestUse[];
  disclosure: DisclosureDto;
  videoId: string | null;
}
