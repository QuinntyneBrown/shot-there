import type { LocationKind } from '@/lib/publishing/location-kind';

/** A location whose price or permit data is stale or due for re-verification soon. */
export interface VerificationItem {
  kind: LocationKind;
  id: string;
  name: string;
  field: 'price' | 'permit';
  lastVerifiedAt: string;
  ageDays: number;
  group: 'stale' | 'dueSoon';
}
