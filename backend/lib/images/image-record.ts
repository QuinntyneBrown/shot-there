import type { ImageRole } from '@/lib/images/image-role';
import type { ImageVariantRecord } from '@/lib/images/image-variant-record';

export interface ImageRecord {
  id: string;
  role: ImageRole;
  sortOrder: number;
  altText: string;
  caption: string | null;
  focalLengthMm: number | null;
  angleNote: string | null;
  width: number;
  height: number;
  storageKey: string;
  contentType: string;
  originalName: string;
  variants: ImageVariantRecord[];
}
