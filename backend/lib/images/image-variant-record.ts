import type { ImageFormat } from '@/lib/images/image-format';

export interface ImageVariantRecord {
  width: number;
  format: ImageFormat;
  storageKey: string;
  url: string;
}
