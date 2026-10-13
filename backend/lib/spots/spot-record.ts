import type { ImageRecord } from '@/lib/images/image-record';
import type { Disclosure } from '@/lib/publishing/disclosure';
import type { LocationStatus } from '@/lib/publishing/location-status';
import type { BestUse } from '@/lib/spots/best-use';
import type { CrowdLevel } from '@/lib/spots/crowd-level';
import type { PermitRequirementRecord } from '@/lib/spots/permit-requirement-record';
import type { SpotLightBySeasonRecord } from '@/lib/spots/spot-light-by-season-record';
import type { SpotLightByTimeRecord } from '@/lib/spots/spot-light-by-time-record';
import type { SpotType } from '@/lib/spots/spot-type';

/** An outdoor spot with its permits and images. Draft spots may leave standard fields empty. Dates are ISO `YYYY-MM-DD`. */
export interface SpotRecord {
  id: string;
  slug: string;
  status: LocationStatus;
  name: string;
  neighbourhood: string | null;
  type: SpotType | null;
  latitude: number | null;
  longitude: number | null;
  directions: string | null;
  lightByTime: SpotLightByTimeRecord[];
  lightBySeason: SpotLightBySeasonRecord[];
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
  permits: PermitRequirementRecord[];
  permitSourceUrl: string | null;
  permitVerifiedAt: string;
  bestUses: BestUse[];
  disclosure: Disclosure | null;
  disclosureProvider: string | null;
  videoId: string | null;
  episodeTitle: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  images: ImageRecord[];
}
