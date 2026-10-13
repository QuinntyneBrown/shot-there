import { ImageVariantDto } from './image-variant-dto';

/** A photo with its alt text, optional caption and stored sizes, smallest first. */
export interface ImageDto {
  id: string;
  alt: string;
  caption: string | null;
  variants: ImageVariantDto[];
}
