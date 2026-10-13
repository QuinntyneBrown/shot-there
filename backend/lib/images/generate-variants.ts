import sharp from 'sharp';
import { getDependencies } from '@/lib/data/dependency-container';
import type { ImageFormat } from '@/lib/images/image-format';
import { imageUrl } from '@/lib/images/image-url';
import type { ImageVariantRecord } from '@/lib/images/image-variant-record';
import { VARIANT_WIDTHS } from '@/lib/images/variant-widths';

const IMMUTABLE = 'public, max-age=31536000, immutable';
const FORMATS: { format: ImageFormat; extension: string; contentType: string }[] = [
  { format: 'avif', extension: 'avif', contentType: 'image/avif' },
  { format: 'webp', extension: 'webp', contentType: 'image/webp' },
  { format: 'jpeg', extension: 'jpg', contentType: 'image/jpeg' },
];

/** Every standard width the source can fill, or the source's own width when it is narrower than all of them. */
function widthsFor(sourceWidth: number): number[] {
  const widths = VARIANT_WIDTHS.filter((width) => width <= sourceWidth);
  return widths.length > 0 ? widths : [sourceWidth];
}

/** Resizes the source to each width in AVIF, WebP and JPEG and stores each as an immutable object. Never upscales. */
export async function generateVariants(imageId: string, source: Buffer, sourceWidth: number): Promise<ImageVariantRecord[]> {
  const { objectStore } = getDependencies();
  const variants: ImageVariantRecord[] = [];
  for (const width of widthsFor(sourceWidth)) {
    for (const { format, extension, contentType } of FORMATS) {
      const body = await sharp(source).rotate().resize({ width }).toFormat(format).toBuffer();
      const storageKey = `images/${imageId}/${width}.${extension}`;
      await objectStore.putObject(storageKey, body, contentType, IMMUTABLE);
      variants.push({ width, format, storageKey, url: imageUrl(storageKey) });
    }
  }
  return variants;
}
