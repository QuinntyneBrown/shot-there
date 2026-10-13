import type { AcceptedImageType } from '@/lib/images/accepted-image-type';

export interface InspectedImage {
  contentType: AcceptedImageType;
  width: number;
  height: number;
}
