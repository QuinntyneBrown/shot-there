import type { ImageDto } from '@/lib/images/image-dto';

/** An attached image in the owner's editor; `alt` is empty until the owner saves it. */
export interface EditorImage {
  imageId: string;
  alt: string;
  preview: ImageDto;
}
