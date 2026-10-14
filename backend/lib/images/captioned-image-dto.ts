import type { ImageDto } from '@/lib/images/image-dto';

/** A standard test shot and its setup caption. */
export interface CaptionedImageDto {
  image: ImageDto;
  caption: string;
}
