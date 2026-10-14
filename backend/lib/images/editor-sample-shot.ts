import type { ImageDto } from '@/lib/images/image-dto';

/** A spot sample shot in the owner's editor; lens and angle are null only straight after upload. */
export interface EditorSampleShot {
  imageId: string;
  alt: string;
  focalLengthMm: number | null;
  angleNote: string | null;
  preview: ImageDto;
}
