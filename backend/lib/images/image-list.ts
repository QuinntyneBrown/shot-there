import type { ImageRole } from '@/lib/images/image-role';
import type { ImageListItem } from '@/lib/images/image-list-item';

/** One role's image list from a save body: `field` names it in errors, and array order is the position. */
export interface ImageList {
  field: string;
  role: ImageRole;
  items: ImageListItem[];
}
