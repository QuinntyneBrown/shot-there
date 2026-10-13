import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRole } from '@/lib/images/image-role';

export interface UploadImageInput {
  owner: ImageOwner;
  role: ImageRole;
  bytes: Buffer;
  declaredType: string;
  originalName: string;
}
