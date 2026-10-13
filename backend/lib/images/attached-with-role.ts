import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRole } from '@/lib/images/image-role';

/** Every attached image with the role, in configured order, alt text or not. */
export function attachedWithRole(images: ImageRecord[], role: ImageRole): ImageRecord[] {
  return images.filter((image) => image.role === role).sort((a, b) => a.sortOrder - b.sortOrder);
}
