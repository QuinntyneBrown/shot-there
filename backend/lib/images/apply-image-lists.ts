import { validationFailed } from '@/lib/http/validation-failed';
import type { ImageList } from '@/lib/images/image-list';
import type { ImageRecord } from '@/lib/images/image-record';

/**
 * The location's images with each list's order and details applied; array index is the position. Throws a 400
 * `invalid_value` on any list that does not name exactly the images attached for its role (ICD E21, A18).
 */
export function applyImageLists(images: ImageRecord[], lists: ImageList[]): ImageRecord[] {
  const errors = lists.flatMap(({ field, role, items }) => {
    const attached = images.filter((image) => image.role === role).map((image) => image.id).sort();
    const named = items.map((item) => item.imageId).sort();
    const same = attached.length === named.length && attached.every((id, index) => id === named[index]);
    return same ? [] : [{ field, code: 'invalid_value' as const, message: 'List exactly the images attached for this role' }];
  });
  if (errors.length > 0) throw validationFailed(errors);

  return images.map((image) => {
    const items = lists.find((list) => list.role === image.role)?.items ?? [];
    const position = items.findIndex((item) => item.imageId === image.id);
    if (position === -1) return image;
    const { alt, caption, focalLengthMm, angleNote } = items[position];
    return {
      ...image,
      sortOrder: position,
      altText: alt,
      caption: caption ?? image.caption,
      focalLengthMm: focalLengthMm ?? image.focalLengthMm,
      angleNote: angleNote ?? image.angleNote,
    };
  });
}
