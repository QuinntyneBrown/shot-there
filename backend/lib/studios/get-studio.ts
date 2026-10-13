import { getDependencies } from '@/lib/data/dependency-container';
import { listGuidesForStudio } from '@/lib/guides/list-guides-for-studio';
import { imagesWithRole, toCaptionedImageDto, toImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import type { GearItemDto } from '@/lib/studios/gear-item-dto';
import type { GearItemRecord } from '@/lib/studios/gear-item-record';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
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
    specifications: {
      usableWidthM: studio.usableWidthM,
      usableDepthM: studio.usableDepthM,
      ceilingHeightM: studio.ceilingHeightM,
      windowDirection: studio.windowDirection,
      naturalLight: {
        morning: studio.lightMorning,
        midday: studio.lightMidday,
        afternoon: studio.lightAfternoon,
        evening: studio.lightEvening,
      },
      power: { outletCount: studio.outletCount, outletType: studio.outletType, has20ACircuits: studio.has20ACircuits },
      cycWall: { present: studio.hasCycWall, condition: studio.hasCycWall ? studio.cycWallCondition : null },
      backdrops: studio.backdrops,
    },
    gear: {
      included: studio.gear.filter((item) => item.included).map(toGearItemDto),
      extras: studio.gear.filter((item) => !item.included).map(toGearItemDto),
    },
    logistics: {
      loadIn: studio.loadIn,
      loadInNote: studio.loadInNote,
      parking: studio.parking,
      parkingNote: studio.parkingNote,
      transit: studio.transit,
      washroom: studio.washroom,
      changingArea: studio.changingArea,
      clientSeating: studio.clientSeating,
      noise: studio.noise,
    },
    testShots: imagesWithRole(studio.images, 'test_shot').map(toCaptionedImageDto),
    gallery: imagesWithRole(studio.images, 'gallery').map(toImageDto),
    verdict: {
      whoItsFor: studio.whoItsFor,
      whoShouldSkip: studio.whoShouldSkip,
      scores: rubricScoresOf(studio),
      overallScore: computeOverallScore(rubricScoresOf(studio)),
    },
    disclosure: { kind: studio.disclosure, provider: studio.disclosureProvider },
    episode: studio.videoId ? { videoId: studio.videoId, title: studio.episodeTitle } : null,
    ogImageUrl: studio.ogImageUrl,
    featuredIn: await listGuidesForStudio(studio.id),
    reviewedAt: (studio.publishedAt ?? studio.updatedAt).toISOString(),
  };
}

function toGearItemDto({ name, category, quantity, extraCost }: GearItemRecord): GearItemDto {
  return { name, category, quantity, extraCost };
}
