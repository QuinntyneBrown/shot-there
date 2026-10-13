import { getDependencies } from '@/lib/data/dependency-container';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** One studio of any status, with its fees, gear and images, for the owner's editor. */
export async function getStudioForEdit(id: string): Promise<StudioRecord | null> {
  return getDependencies().studios.findById(id);
}
