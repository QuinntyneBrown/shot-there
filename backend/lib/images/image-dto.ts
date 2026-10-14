import type { ImageSourceDto } from '@/lib/images/image-source-dto';

/** A responsive image: one source per format, AVIF first, and a JPEG fallback. */
export interface ImageDto {
  /** Never empty on public responses (ICD S-8). */
  alt: string;
  width: number;
  height: number;
  sources: ImageSourceDto[];
  fallbackUrl: string;
}
