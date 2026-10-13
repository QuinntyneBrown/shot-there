import type { CrowdLevel } from '@/lib/spots/crowd-level';

/** Null facilities mean none nearby. */
export interface SpotConditionsDto {
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
}
