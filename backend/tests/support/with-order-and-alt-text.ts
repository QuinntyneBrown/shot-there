import type { ImageRecord } from '@/lib/images/image-record';

/** The stored images with the saved record's order, alt text, caption, lens and angle, as the Prisma save writes them. */
export function withOrderAndAltText(stored: ImageRecord[], saved: ImageRecord[]): ImageRecord[] {
  return stored.map((image) => {
    const update = saved.find((candidate) => candidate.id === image.id);
    if (!update) return image;
    const { sortOrder, altText, caption, focalLengthMm, angleNote } = update;
    return { ...image, sortOrder, altText, caption, focalLengthMm, angleNote };
  });
}
