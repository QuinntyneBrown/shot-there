import type { ImageDto } from '@/lib/images/image-dto';

/** One studio card in the public list and in guides (ICD §13.2). */
export interface StudioSummary {
  slug: string;
  name: string;
  neighbourhood: string;
  allInCost2h: number;
  priceStale: boolean;
  overallScore: number;
  /** The time of the latest publish (ICD OI-4). */
  reviewedAt: string;
  /** The first gallery image. */
  thumbnail: ImageDto;
}
