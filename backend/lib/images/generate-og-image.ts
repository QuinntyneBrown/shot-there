import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { getDependencies } from '@/lib/data/dependency-container';
import type { ImageRecord } from '@/lib/images/image-record';
import { imageUrl } from '@/lib/images/image-url';
import { currentCorrelationId } from '@/lib/logging/correlation-context';
import { log } from '@/lib/logging/logger';

const IMMUTABLE = 'public, max-age=31536000, immutable';

/**
 * Crops the image's original to a 1200×630 JPEG stored under a content-hashed key and returns its URL. Null, with the
 * failure logged, when the original cannot be read or converted; publishing does not depend on it.
 */
export async function generateOgImage(image: ImageRecord): Promise<string | null> {
  const { objectStore } = getDependencies();
  try {
    const source = await objectStore.getObject(image.storageKey);
    const og = await sharp(source).rotate().resize({ width: 1200, height: 630, fit: 'cover' }).jpeg().toBuffer();
    const key = `images/og/${createHash('sha256').update(og).digest('hex').slice(0, 16)}.jpg`;
    await objectStore.putObject(key, og, 'image/jpeg', IMMUTABLE);
    return imageUrl(key);
  } catch (error) {
    log('error', currentCorrelationId(), {
      event: 'og-image.failed',
      imageId: image.id,
      errorName: error instanceof Error ? error.name : 'Error',
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
