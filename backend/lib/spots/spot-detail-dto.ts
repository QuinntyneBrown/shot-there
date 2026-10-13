import type { DisclosureDto } from '@/lib/publishing/disclosure-dto';
import type { BestUse } from '@/lib/spots/best-use';
import type { RainBackupStudioDto } from '@/lib/spots/rain-backup-studio-dto';
import type { SampleShotDto } from '@/lib/spots/sample-shot-dto';
import type { SpotConditionsDto } from '@/lib/spots/spot-conditions-dto';
import type { SpotLightBySeasonDto } from '@/lib/spots/spot-light-by-season-dto';
import type { SpotLightByTimeDto } from '@/lib/spots/spot-light-by-time-dto';
import type { SpotPermitsDto } from '@/lib/spots/spot-permits-dto';
import type { SpotType } from '@/lib/spots/spot-type';
import type { EpisodeDto } from '@/lib/videos/episode-dto';

/** The public spot page contract returned by `GET /api/spots/{slug}` (ICD §13.4). */
export interface SpotDetailDto {
  slug: string;
  name: string;
  neighbourhood: string;
  type: SpotType | null;
  latitude: number;
  longitude: number;
  directions: string;
  lightByTime: SpotLightByTimeDto;
  lightBySeason: SpotLightBySeasonDto;
  sampleShots: SampleShotDto[];
  conditions: SpotConditionsDto;
  permits: SpotPermitsDto;
  bestUses: BestUse[];
  disclosure: DisclosureDto;
  episode: EpisodeDto | null;
  /** Up to three published studios, nearest first. */
  rainBackup: RainBackupStudioDto[];
  /** The time of the latest publish (ICD OI-4). */
  reviewedAt: string;
}
