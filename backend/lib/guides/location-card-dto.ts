import type { ThumbnailDto } from '@/lib/images/thumbnail-dto';

export interface LocationCardDto {
  slug: string;
  name: string;
  neighbourhood: string | null;
  thumbnail: ThumbnailDto | null;
}
