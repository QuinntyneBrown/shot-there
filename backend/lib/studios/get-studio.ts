import { getDependencies } from '@/lib/data/dependency-container';
import { listGuidesForStudio } from '@/lib/guides/list-guides-for-studio';
import { imagesWithRole, toCaptionedImageDto, toImageDto } from '@/lib/images/to-image-dto';
import { present } from '@/lib/shared/present';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioDetailDto } from '@/lib/studios/studio-detail-dto';
import { toIncludedGearDto } from '@/lib/studios/to-included-gear-dto';
import { toRubricScoresDto } from '@/lib/studios/to-rubric-scores-dto';
import { toStudioPricingDto } from '@/lib/studios/to-studio-pricing-dto';
import { toStudioSpecificationsDto } from '@/lib/studios/to-studio-specifications-dto';

/** The published studio with the slug, or null. Drafts are never returned. */
export async function getStudio(slug: string): Promise<StudioDetailDto | null> {
  const { studios, clock } = getDependencies();
  const studio = await studios.findPublishedBySlug(slug);
  if (!studio) return null;

  const testShots = imagesWithRole(studio.images, 'test_shot').map(toCaptionedImageDto);
  const gallery = imagesWithRole(studio.images, 'gallery').map(toImageDto);
  return {
    slug: studio.slug,
    basics: {
      name: studio.name,
      neighbourhood: present(studio.neighbourhood, 'neighbourhood'),
      addressOrCrossStreets: present(studio.addressOrCrossStreets, 'addressOrCrossStreets'),
      bookingUrl: present(studio.bookingUrl, 'bookingUrl'),
    },
    pricing: toStudioPricingDto(studio, clock.today()),
    specifications: toStudioSpecificationsDto(studio),
    gear: {
      included: studio.gear.filter((item) => item.included).map(toIncludedGearDto),
      extras: studio.gear.flatMap(({ name, category, quantity, included, extraCost }) =>
        included ? [] : [{ name, category, quantity, extraCost: extraCost ?? 0 }],
      ),
    },
    logistics: {
      loadIn: studio.loadIn,
      loadInNote: studio.loadInNote,
      parking: studio.parking,
      transit: studio.transit,
      washroom: studio.washroom,
      changingArea: studio.changingArea,
      clientSeating: studio.clientSeating,
      noise: studio.noise,
    },
    testShots,
    gallery,
    verdict: {
      whoItsFor: present(studio.whoItsFor, 'whoItsFor'),
      whoShouldSkip: present(studio.whoShouldSkip, 'whoShouldSkip'),
      scores: toRubricScoresDto(studio),
      overallScore: present(computeOverallScore(rubricScoresOf(studio)), 'overallScore'),
    },
    disclosure: { kind: present(studio.disclosure, 'disclosure'), provider: studio.disclosureProvider },
    episode: studio.videoId ? { videoId: studio.videoId, title: studio.episodeTitle ?? studio.name } : null,
    featuredIn: await listGuidesForStudio(studio.id),
    reviewedAt: present(studio.publishedAt, 'publishedAt').toISOString(),
    // Falls back to a page image when no Open Graph crop could be made on publish.
    ogImageUrl: studio.ogImageUrl ?? gallery[0]?.fallbackUrl ?? testShots[0]?.image.fallbackUrl ?? '',
  };
}
