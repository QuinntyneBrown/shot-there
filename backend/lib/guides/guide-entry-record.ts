import type { LocationKind } from '@/lib/publishing/location-kind';

export interface GuideEntryRecord {
  kind: LocationKind;
  locationId: string;
  note: string | null;
  position: number;
}
