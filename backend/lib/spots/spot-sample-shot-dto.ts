import type { ImageDto } from '@/lib/images/image-dto';

export interface SpotSampleShotDto extends ImageDto {
  focalLengthMm: number | null;
  angleNote: string | null;
}
