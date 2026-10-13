import type { LocationKind } from '@/lib/publishing/location-kind';
import type { LocationStatus } from '@/lib/publishing/location-status';

/** A studio or spot the owner can add to a guide. */
export interface GuideCandidate {
  kind: LocationKind;
  id: string;
  name: string;
  neighbourhood: string | null;
  status: LocationStatus;
}
