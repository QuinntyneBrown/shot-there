import type { ImageSourceDto } from '@/lib/images/image-source-dto';

/** A responsive image: one source per format, AVIF first, and a JPEG fallback. */
export interface ImageDto {
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  sources: ImageSourceDto[];
  fallbackUrl: string;
}
