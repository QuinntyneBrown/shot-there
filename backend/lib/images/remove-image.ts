import { getDependencies } from '@/lib/data/dependency-container';
import { conflict } from '@/lib/http/conflict';
import { deleteStoredObjects } from '@/lib/storage/delete-stored-objects';

/**
 * Deletes the image row, then its stored objects. Refuses with 409 when it is the last standard test shot of a published
 * studio (L2-058, ICD E41). False when no image has the id.
 */
export async function removeImage(id: string): Promise<boolean> {
  const { studios, images } = getDependencies();
  const located = await images.findById(id);
  if (!located) return false;

  const { owner, image } = located;
  if (owner.kind === 'studio' && image.role === 'test_shot') {
    const studio = await studios.findById(owner.id);
    const testShots = studio?.images.filter((other) => other.role === 'test_shot') ?? [];
    if (studio?.status === 'published' && testShots.length === 1) {
      throw conflict('At least one standard test shot is required while the studio is published');
    }
  }

  await images.remove(id);
  await deleteStoredObjects([image.storageKey, ...image.variants.map((variant) => variant.storageKey)]);
  return true;
}
