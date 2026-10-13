import { ImageRef } from './image-ref';

/** One studio on the list, as GET /api/studios returns it. */
export interface StudioSummary {
  slug: string;
  name: string;
  neighbourhood: string;
  allInCost2h: number;
  overallScore: number;
  priceStale: boolean;
  /** ISO date, YYYY-MM-DD. */
  reviewedAt: string;
  thumbnail: ImageRef;
}
