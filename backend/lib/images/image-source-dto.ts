import type { ImageFormat } from '@/lib/images/image-format';

export interface ImageSourceDto {
  format: ImageFormat;
  srcset: string;
}
