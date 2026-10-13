import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';

export interface ImageRepository {
  /** Stores the image and its variants for the owner. */
  add(owner: ImageOwner, image: ImageRecord): Promise<void>;
}
