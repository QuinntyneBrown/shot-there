import { conflict } from '@/lib/http/conflict';
import type { LocationStatus } from '@/lib/publishing/location-status';

/** Throws a 409 when the item is published; it must be unpublished before it can be deleted. */
export function refuseIfPublished(status: LocationStatus): void {
  if (status === 'published') {
    throw conflict('Unpublish before deleting');
  }
}
