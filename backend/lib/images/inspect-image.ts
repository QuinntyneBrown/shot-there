import sharp from 'sharp';
import { validationFailed } from '@/lib/http/validation-failed';
import type { AcceptedImageType } from '@/lib/images/accepted-image-type';
import type { InspectedImage } from '@/lib/images/inspected-image';

const UNSUPPORTED = 'Upload a JPEG, PNG, WebP or AVIF image';
const GENERIC_TYPES = ['', 'application/octet-stream'];

function contentTypeOf(format: string | undefined, compression: string | undefined): AcceptedImageType | null {
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  if (format === 'heif' && compression === 'av1') return 'image/avif';
  return null;
}

/**
 * Reads the format and size from the file's bytes, never its name. Throws a 400 for anything but JPEG, PNG, WebP or
 * AVIF, and when the declared type contradicts the content.
 */
export async function inspectImage(bytes: Buffer, declaredType: string): Promise<InspectedImage> {
  const metadata = await sharp(bytes)
    .metadata()
    .catch(() => null);
  const contentType = contentTypeOf(metadata?.format, metadata?.compression);
  if (!metadata || !contentType) throw validationFailed([{ field: 'file', message: UNSUPPORTED }]);
  if (!GENERIC_TYPES.includes(declaredType) && declaredType !== contentType) {
    throw validationFailed([{ field: 'file', message: 'The file content does not match its type' }]);
  }
  const { width, height } = metadata.autoOrient;
  return { contentType, width, height };
}
