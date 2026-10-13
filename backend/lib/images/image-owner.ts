import type { LocationKind } from '@/lib/publishing/location-kind';

/** The studio or spot an image belongs to. */
export interface ImageOwner {
  kind: LocationKind;
  id: string;
}
