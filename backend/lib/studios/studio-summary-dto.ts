import type { ThumbnailDto } from '@/lib/images/thumbnail-dto';

/** One studio card in the public list. */
export interface StudioSummaryDto {
  slug: string;
  name: string;
  neighbourhood: string | null;
  allInCost2h: number | null;
  overallScore: number | null;
  priceStale: boolean;
  reviewedAt: string | null;
  thumbnail: ThumbnailDto | null;
}
