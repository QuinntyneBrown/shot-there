import type { ImageDto } from '@/lib/images/image-dto';
import type { ImageRole } from '@/lib/images/image-role';

/** A stored upload (ICD E40); its preview's alt is empty until the owner saves alt text. */
export interface UploadedImageDto {
  imageId: string;
  role: ImageRole;
  preview: ImageDto;
}
