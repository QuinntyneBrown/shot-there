import type { ComparedStudioDto } from '@/lib/compare/compared-studio-dto';
import type { ComparisonDto } from '@/lib/compare/comparison-dto';
import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole, toCaptionedImageDto } from '@/lib/images/to-image-dto';
import { present } from '@/lib/shared/present';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioRecord } from '@/lib/studios/studio-record';
import { toIncludedGearDto } from '@/lib/studios/to-included-gear-dto';
import { toRubricScoresDto } from '@/lib/studios/to-rubric-scores-dto';
import { toStudioPricingDto } from '@/lib/studios/to-studio-pricing-dto';
import { toStudioSpecificationsDto } from '@/lib/studios/to-studio-specifications-dto';

const MAX_COMPARED = 4;

/** Published studios in URL order; unknown and draft slugs are dropped before the four-studio cap. */
export async function getComparison(slugs: string[]): Promise<ComparisonDto> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  const bySlug = new Map((await studios.listPublished()).map((studio) => [studio.slug, studio]));
  const found = slugs.map((slug) => bySlug.get(slug)).filter((studio): studio is StudioRecord => !!studio);
  const compared = found.slice(0, MAX_COMPARED).map((studio): ComparedStudioDto => ({
    slug: studio.slug,
    name: studio.name,
    pricing: toStudioPricingDto(studio, today),
    specifications: toStudioSpecificationsDto(studio),
    includedGear: studio.gear.filter((item) => item.included).map(toIncludedGearDto),
    parking: studio.parking,
    loadIn: studio.loadIn,
    scores: toRubricScoresDto(studio),
    overallScore: present(computeOverallScore(rubricScoresOf(studio)), 'overallScore'),
    testShots: imagesWithRole(studio.images, 'test_shot').map(toCaptionedImageDto),
    isLowestAllInCost: false,
  }));
  const lowest = Math.min(...compared.map((studio) => studio.pricing.allInCost2h));

  return {
    studios: compared.map((studio) => ({ ...studio, isLowestAllInCost: studio.pricing.allInCost2h === lowest })),
    notFoundSlugs: slugs.filter((slug) => !bySlug.has(slug)),
    truncated: found.length > MAX_COMPARED,
  };
}
