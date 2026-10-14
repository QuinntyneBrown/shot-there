import type { LocationStatus } from '@/lib/publishing/location-status';

/** The result of a publish or unpublish (ICD §13.9, A13). */
export interface PublicationStatusDto {
  status: LocationStatus;
  publishedAt: string | null;
}
