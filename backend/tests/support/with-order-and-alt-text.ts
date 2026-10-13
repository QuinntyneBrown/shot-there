import type { ImageRecord } from '@/lib/images/image-record';

/** The stored images with the saved record's order and alt text, as the Prisma save writes them. */
export function withOrderAndAltText(stored: ImageRecord[], saved: ImageRecord[]): ImageRecord[] {
  return stored.map((image) => {
    const update = saved.find((candidate) => candidate.id === image.id);
    return update ? { ...image, sortOrder: update.sortOrder, altText: update.altText } : image;
  });
}
