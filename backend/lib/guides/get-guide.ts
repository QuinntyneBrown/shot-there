import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideDto } from '@/lib/guides/guide-dto';
import type { GuideEntryDto } from '@/lib/guides/guide-entry-dto';
import { toSpotSummary } from '@/lib/spots/to-spot-summary';
import { toStudioSummary } from '@/lib/studios/to-studio-summary';

/** The published guide with entries in configured order; entries whose location is not shown publicly are dropped. */
export async function getGuide(slug: string): Promise<GuideDto | null> {
  const { guides, studios, spots, clock } = getDependencies();
  const guide = await guides.findPublishedBySlug(slug);
  if (!guide) return null;

  const today = clock.today();
  const [publishedStudios, publishedSpots] = await Promise.all([studios.listPublished(), spots.listPublished()]);
  const studiosById = new Map(publishedStudios.map((studio) => [studio.id, studio]));
  const spotsById = new Map(publishedSpots.map((spot) => [spot.id, spot]));

  const entries = [...guide.entries]
    .sort((a, b) => a.position - b.position)
    .flatMap((entry): GuideEntryDto[] => {
      if (entry.kind === 'studio') {
        const studio = studiosById.get(entry.locationId);
        const location = studio && toStudioSummary(studio, today);
        if (!location) return [];
        const values = { all_in_cost_2h: location.allInCost2h, overall_score: location.overallScore };
        const dataPoints = guide.dataPoints.map((key) => ({ key, value: values[key] }));
        return [{ kind: 'studio', location, dataPoints, editorNote: entry.note }];
      }
      const spot = spotsById.get(entry.locationId);
      const location = spot && toSpotSummary(spot, today);
      return location ? [{ kind: 'spot', location, dataPoints: [], editorNote: entry.note }] : [];
    });

  const { title, summary, introduction } = guide;
  return { slug: guide.slug, title, summary, introduction, entries };
}
