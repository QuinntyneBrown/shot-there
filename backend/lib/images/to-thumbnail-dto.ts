import type { ImageRecord } from '@/lib/images/image-record';
import type { ThumbnailDto } from '@/lib/images/thumbnail-dto';

/** The smallest JPEG variant of the image, used on list cards. */
export function toThumbnailDto(image: ImageRecord | undefined): ThumbnailDto | null {
  if (!image) return null;
  const smallestJpeg = image.variants
    .filter((variant) => variant.format === 'jpeg')
    .sort((a, b) => a.width - b.width)[0];
  return smallestJpeg ? { url: smallestJpeg.url, alt: image.altText } : null;
}
