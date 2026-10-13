import type { ImageDto } from '@/lib/images/image-dto';
import type { ImageFormat } from '@/lib/images/image-format';
import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRole } from '@/lib/images/image-role';

const FORMAT_ORDER: ImageFormat[] = ['avif', 'webp', 'jpeg'];
const FALLBACK_WIDTH = 960;

export function toImageDto(image: ImageRecord): ImageDto {
  const byWidth = [...image.variants].sort((a, b) => a.width - b.width);
  const jpegs = byWidth.filter((variant) => variant.format === 'jpeg');
  const fallback = jpegs.find((variant) => variant.width === FALLBACK_WIDTH) ?? jpegs.at(-1);
  return {
    alt: image.altText,
    caption: image.caption,
    width: image.width,
    height: image.height,
    sources: FORMAT_ORDER.map((format) => ({
      format,
      srcset: byWidth
        .filter((variant) => variant.format === format)
        .map((variant) => `${variant.url} ${variant.width}w`)
        .join(', '),
    })).filter((source) => source.srcset !== ''),
    fallbackUrl: fallback?.url ?? '',
  };
}

/** The images with the role, in their configured order. */
export function imagesWithRole(images: ImageRecord[], role: ImageRole): ImageRecord[] {
  return images.filter((image) => image.role === role).sort((a, b) => a.sortOrder - b.sortOrder);
}
