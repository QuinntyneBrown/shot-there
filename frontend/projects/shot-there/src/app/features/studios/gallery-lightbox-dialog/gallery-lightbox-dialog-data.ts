import { ImageDto } from '@shot-there/api';

export interface GalleryLightboxDialogData {
  studioName: string;
  images: ImageDto[];
  /** Zero-based index of the photo to open on. */
  index: number;
}
