import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';
import type { LocatedImage } from '@/lib/images/located-image';

export interface ImageRepository {
  /** Stores the image and its variants for the owner. */
  add(owner: ImageOwner, image: ImageRecord): Promise<void>;
  findById(id: string): Promise<LocatedImage | null>;
  /** Deletes the image row and its variant rows. */
  remove(id: string): Promise<void>;
}
