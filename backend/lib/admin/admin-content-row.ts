import type { LocationStatus } from '@/lib/publishing/location-status';

/** One row of an administration list. */
export interface AdminContentRow {
  id: string;
  name: string;
  /** Null for guides. */
  neighbourhood: string | null;
  status: LocationStatus;
  updatedAt: string;
  stale: boolean;
}
