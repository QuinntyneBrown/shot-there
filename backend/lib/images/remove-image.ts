import { getDependencies } from '@/lib/data/dependency-container';
import { conflict } from '@/lib/http/conflict';
import type { ImageRole } from '@/lib/images/image-role';
import { deleteStoredObjects } from '@/lib/storage/delete-stored-objects';

const REQUIRED_WHILE_PUBLISHED: Partial<Record<ImageRole, string>> = {
  test_shot: 'At least one standard test shot is required while the studio is published',
  gallery: 'At least one gallery image is required while the studio is published',
  sample_shot: 'At least one sample shot is required while the spot is published',
};

/**
 * Deletes the image rows, then its stored objects. Refuses with 409 when it is the last image of a role a published
 * location must keep. False when no image has the id.
 */
export async function removeImage(id: string): Promise<boolean> {
  const { studios, spots, images } = getDependencies();
  const located = await images.findById(id);
  if (!located) return false;

  const { owner, image } = located;
  const location = owner.kind === 'studio' ? await studios.findById(owner.id) : await spots.findById(owner.id);
  const sameRole = location?.images.filter((other) => other.role === image.role) ?? [];
  const message = REQUIRED_WHILE_PUBLISHED[image.role];
  if (location?.status === 'published' && message && sameRole.length === 1) {
    throw conflict(message);
  }

  await images.remove(id);
  await deleteStoredObjects([image.storageKey, ...image.variants.map((variant) => variant.storageKey)]);
  return true;
}
