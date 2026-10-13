import { getDependencies } from '@/lib/data/dependency-container';
import type { SpotRecord } from '@/lib/spots/spot-record';

/** One spot of any status, with its permits and images, for the owner's editor. */
export async function getSpotForEdit(id: string): Promise<SpotRecord | null> {
  return getDependencies().spots.findById(id);
}
