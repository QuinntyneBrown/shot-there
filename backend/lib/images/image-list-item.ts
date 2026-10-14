/** One image in a save body's image list, with the fields its role carries. */
export interface ImageListItem {
  imageId: string;
  alt: string;
  caption?: string;
  focalLengthMm?: number;
  angleNote?: string;
}
