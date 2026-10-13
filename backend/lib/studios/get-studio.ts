import { getDependencies } from '@/lib/data/dependency-container';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import type { StudioDetailDto } from '@/lib/studios/studio-detail-dto';

/** The published studio with the slug, or null. Drafts are never returned. */
export async function getStudio(slug: string): Promise<StudioDetailDto | null> {
  const { studios, clock } = getDependencies();
  const studio = await studios.findPublishedBySlug(slug);
  if (!studio) return null;

  return {
    slug: studio.slug,
    basics: {
      name: studio.name,
      neighbourhood: studio.neighbourhood,
      addressOrCrossStreets: studio.addressOrCrossStreets,
      bookingUrl: studio.bookingUrl,
    },
    pricing: {
      hourlyRate: studio.hourlyRate,
      minBookingHours: studio.minBookingHours,
      fees: studio.fees.map(({ name, amount, mandatory }) => ({ name, amount, mandatory })),
      allInCost2h: allInCostOf(studio),
      priceVerifiedAt: studio.priceVerifiedAt,
      priceStale: isStale(studio.priceVerifiedAt, clock.today()),
    },
  };
}
