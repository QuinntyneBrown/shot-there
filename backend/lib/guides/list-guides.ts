import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideSummaryDto } from '@/lib/guides/guide-summary-dto';

/** Published guides, most recently published first (ICD OI-9). */
export async function listGuides(): Promise<GuideSummaryDto[]> {
  const guides = await getDependencies().guides.listPublished();
  return guides
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .map(({ slug, title, summary }) => ({ slug, title, summary }));
}
