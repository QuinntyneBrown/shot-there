import type { ComparedStudioDto } from '@/lib/compare/compared-studio-dto';
import type { ComparisonDto } from '@/lib/compare/comparison-dto';
import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole, toCaptionedImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioRecord } from '@/lib/studios/studio-record';

const MAX_COMPARED = 4;

/** Published studios in URL order; unknown and draft slugs are dropped before the four-studio cap. */
export async function getComparison(slugs: string[]): Promise<ComparisonDto> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  const bySlug = new Map((await studios.listPublished()).map((studio) => [studio.slug, studio]));
  const found = slugs.map((slug) => bySlug.get(slug)).filter((studio): studio is StudioRecord => !!studio);
  const compared = found.slice(0, MAX_COMPARED);
  const costs = compared.map(allInCostOf).filter((cost): cost is number => cost !== null);
  const lowest = costs.length > 0 ? Math.min(...costs) : null;

  return {
    studios: compared.map((studio): ComparedStudioDto => {
      const allInCost2h = allInCostOf(studio);
      return {
        slug: studio.slug,
        name: studio.name,
        allInCost2h,
        isLowestAllInCost: allInCost2h !== null && allInCost2h === lowest,
        hourlyRate: studio.hourlyRate,
        minBookingHours: studio.minBookingHours,
        mandatoryFees: studio.fees.filter((fee) => fee.mandatory).map(({ name, amount, mandatory }) => ({ name, amount, mandatory })),
        usableWidthM: studio.usableWidthM,
        usableDepthM: studio.usableDepthM,
        ceilingHeightM: studio.ceilingHeightM,
        naturalLight: {
          morning: studio.lightMorning,
          midday: studio.lightMidday,
          afternoon: studio.lightAfternoon,
          evening: studio.lightEvening,
        },
        cycWall: { present: studio.hasCycWall, condition: studio.hasCycWall ? studio.cycWallCondition : null },
        includedGear: studio.gear
          .filter((item) => item.included)
          .map(({ name, category, quantity, extraCost }) => ({ name, category, quantity, extraCost })),
        parking: studio.parking,
        loadIn: studio.loadIn,
        scores: rubricScoresOf(studio),
        overallScore: computeOverallScore(rubricScoresOf(studio)),
        priceVerifiedAt: studio.priceVerifiedAt,
        priceStale: isStale(studio.priceVerifiedAt, today),
        testShots: imagesWithRole(studio.images, 'test_shot').map(toCaptionedImageDto),
      };
    }),
    notFoundSlugs: slugs.filter((slug) => !bySlug.has(slug)),
    truncated: found.length > MAX_COMPARED,
  };
}
