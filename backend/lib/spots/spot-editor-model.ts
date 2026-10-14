import type { EditorSampleShot } from '@/lib/images/editor-sample-shot';
import type { Disclosure } from '@/lib/publishing/disclosure';
import type { LocationStatus } from '@/lib/publishing/location-status';
import type { BestUse } from '@/lib/spots/best-use';
import type { CrowdLevel } from '@/lib/spots/crowd-level';
import type { PermitsByShootTypeInput } from '@/lib/spots/permits-by-shoot-type-input';
import type { SpotLightBySeasonInput } from '@/lib/spots/spot-light-by-season-input';
import type { SpotLightByTimeInput } from '@/lib/spots/spot-light-by-time-input';
import type { SpotType } from '@/lib/spots/spot-type';

/** A spot of any status as the owner's editor reads it (ICD §13.11). */
export interface SpotEditorModel {
  id: string;
  slug: string;
  status: LocationStatus;
  publishedAt: string | null;
  updatedAt: string;
  name: string;
  neighbourhood: string | null;
  type: SpotType | null;
  latitude: number | null;
  longitude: number | null;
  directions: string | null;
  lightByTime: SpotLightByTimeInput;
  lightBySeason: SpotLightBySeasonInput;
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
  permits: PermitsByShootTypeInput;
  permitSourceUrl: string | null;
  permitVerifiedAt: string;
  bestUses: BestUse[];
  disclosure: Disclosure | null;
  disclosureProvider: string | null;
  /** The stored video ID. */
  videoLink: string | null;
  episodeTitle: string | null;
  sampleShots: EditorSampleShot[];
}
