import type { LocationKind } from '@/lib/publishing/location-kind';
import type { LocationStatus } from '@/lib/publishing/location-status';

/** A guide entry with its location's name and status, for the owner's editor. */
export interface GuideEditorEntry {
  kind: LocationKind;
  locationId: string;
  name: string;
  status: LocationStatus;
  note: string | null;
}
