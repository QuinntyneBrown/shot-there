import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideDto } from '@/lib/guides/guide-dto';
import type { GuideEntryDto } from '@/lib/guides/guide-entry-dto';
import { imagesWithRole } from '@/lib/images/to-image-dto';
import { toThumbnailDto } from '@/lib/images/to-thumbnail-dto';
import { summarizePermits } from '@/lib/spots/summarize-permits';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';

/** The published guide with entries in configured order; entries whose location is no longer published are dropped. */
export async function getGuide(slug: string): Promise<GuideDto | null> {
  const { guides, studios, spots } = getDependencies();
  const guide = await guides.findPublishedBySlug(slug);
  if (!guide) return null;

  const [publishedStudios, publishedSpots] = await Promise.all([studios.listPublished(), spots.listPublished()]);
  const studiosById = new Map(publishedStudios.map((studio) => [studio.id, studio]));
  const spotsById = new Map(publishedSpots.map((spot) => [spot.id, spot]));

  const entries = [...guide.entries]
    .sort((a, b) => a.position - b.position)
    .flatMap((entry): GuideEntryDto[] => {
      if (entry.kind === 'studio') {
        const studio = studiosById.get(entry.locationId);
        if (!studio) return [];
        const thumbnail = toThumbnailDto(
          imagesWithRole(studio.images, 'gallery')[0] ?? imagesWithRole(studio.images, 'testShot')[0],
        );
        return [
          {
            position: entry.position,
            kind: 'studio',
            location: { slug: studio.slug, name: studio.name, neighbourhood: studio.neighbourhood, thumbnail },
            dataPoints: [
              { label: 'allInCost2h', value: allInCostOf(studio) },
              { label: 'overallScore', value: computeOverallScore(rubricScoresOf(studio)) },
            ],
            editorNote: entry.note,
          },
        ];
      }
      const spot = spotsById.get(entry.locationId);
      if (!spot) return [];
      const thumbnail = toThumbnailDto(imagesWithRole(spot.images, 'sampleShot')[0]);
      return [
        {
          position: entry.position,
          kind: 'spot',
          location: { slug: spot.slug, name: spot.name, neighbourhood: spot.neighbourhood, thumbnail },
          dataPoints: [{ label: 'permitSummary', value: summarizePermits(spot.permits) }],
          editorNote: entry.note,
        },
      ];
    });

  return { slug: guide.slug, title: guide.title, introduction: guide.introduction, entries };
}
