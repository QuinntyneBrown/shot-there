import { getDependencies } from '@/lib/data/dependency-container';
import { generateVariants } from '@/lib/images/generate-variants';
import type { ImageRecord } from '@/lib/images/image-record';
import { inspectImage } from '@/lib/images/inspect-image';
import type { UploadImageInput } from '@/lib/images/upload-image-input';

/**
 * Inspects the file, stores the original and its variants under server-generated keys, then records the image last in
 * its role's order. Null when the owning location does not exist; nothing is stored then.
 */
export async function uploadImage({
  owner,
  role,
  bytes,
  declaredType,
  originalName,
}: UploadImageInput): Promise<ImageRecord | null> {
  const { studios, spots, images, objectStore } = getDependencies();
  const location = owner.kind === 'studio' ? await studios.findById(owner.id) : await spots.findById(owner.id);
  if (!location) return null;

  const inspected = await inspectImage(bytes, declaredType);
  const id = crypto.randomUUID();
  const storageKey = `images/${id}/original`;
  await objectStore.putObject(storageKey, bytes, inspected.contentType);
  const variants = await generateVariants(id, bytes, inspected.width);

  const sameRole = location.images.filter((image) => image.role === role);
  const image: ImageRecord = {
    id,
    role,
    sortOrder: sameRole.length === 0 ? 0 : Math.max(...sameRole.map((other) => other.sortOrder)) + 1,
    altText: '',
    caption: null,
    focalLengthMm: null,
    angleNote: null,
    width: inspected.width,
    height: inspected.height,
    storageKey,
    contentType: inspected.contentType,
    originalName,
    variants,
  };
  await images.add(owner, image);
  return image;
}
