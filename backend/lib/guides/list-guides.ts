import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideSummaryDto } from '@/lib/guides/guide-summary-dto';

/** Published guides ordered by title. */
export async function listGuides(): Promise<GuideSummaryDto[]> {
  const guides = await getDependencies().guides.listPublished();
  return guides
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((guide) => ({ slug: guide.slug, title: guide.title, summary: guide.introduction.split(/\n\s*\n/)[0].trim() }));
}
