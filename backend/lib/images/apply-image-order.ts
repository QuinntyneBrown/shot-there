import { validationFailed } from '@/lib/http/validation-failed';
import type { ImageOrderItem } from '@/lib/images/image-order-item';
import type { ImageRecord } from '@/lib/images/image-record';

/**
 * The location's images with each listed image's order and alt text applied; unlisted images keep theirs. Throws a 400
 * naming any listed id that is not one of the location's images.
 */
export function applyImageOrder(images: ImageRecord[], items: ImageOrderItem[] = []): ImageRecord[] {
  const unknown = items.flatMap((item, index) =>
    images.some((image) => image.id === item.id)
      ? []
      : [{ field: `images.${index}.id`, code: 'invalid_value' as const, message: 'This image does not belong to this location' }],
  );
  if (unknown.length > 0) throw validationFailed(unknown);

  return images.map((image) => {
    const item = items.find((candidate) => candidate.id === image.id);
    return item ? { ...image, sortOrder: item.sortOrder, altText: item.altText } : image;
  });
}
