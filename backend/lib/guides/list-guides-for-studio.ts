import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideLinkDto } from '@/lib/guides/guide-link-dto';

/** Published guides with an entry for the studio, most recently published first (ICD OI-9). Read at request time. */
export async function listGuidesForStudio(studioId: string): Promise<GuideLinkDto[]> {
  const guides = await getDependencies().guides.listPublished();
  return guides
    .filter((guide) => guide.entries.some((entry) => entry.kind === 'studio' && entry.locationId === studioId))
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .map(({ slug, title }) => ({ slug, title }));
}
