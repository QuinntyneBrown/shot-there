import type { ImageDto } from '@/lib/images/image-dto';

/** A spot sample shot with the lens and angle it was taken with. */
export interface SampleShotDto {
  image: ImageDto;
  focalLengthMm: number;
  angleNote: string;
}
