import { getDependencies } from '@/lib/data/dependency-container';
import { refuseIfPublished } from '@/lib/deletion/refuse-if-published';
import type { LocationKind } from '@/lib/publishing/location-kind';
import { deleteStoredObjects } from '@/lib/storage/delete-stored-objects';

/**
 * Deletes a draft studio or spot with its child rows, images and the guide entries that reference it, then its stored
 * objects. Refuses a published location with 409. False when no location of the kind has the id.
 */
export async function deleteLocation(kind: LocationKind, id: string): Promise<boolean> {
  const { studios, spots } = getDependencies();
  const repository = kind === 'studio' ? studios : spots;
  const location = await repository.findById(id);
  if (!location) return false;
  refuseIfPublished(location.status);

  await repository.delete(id);
  const keys = location.images.flatMap((image) => [image.storageKey, ...image.variants.map((variant) => variant.storageKey)]);
  if (keys.length > 0) await deleteStoredObjects(keys);
  return true;
}
