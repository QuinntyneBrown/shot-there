import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';

/** An image with the location it belongs to. */
export interface LocatedImage {
  owner: ImageOwner;
  image: ImageRecord;
}
