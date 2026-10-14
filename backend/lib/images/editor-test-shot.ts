import type { ImageDto } from '@/lib/images/image-dto';

export interface EditorTestShot {
  imageId: string;
  alt: string;
  caption: string;
  preview: ImageDto;
}
