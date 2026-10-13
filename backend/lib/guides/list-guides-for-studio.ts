import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideLinkDto } from '@/lib/guides/guide-link-dto';

/** Published guides with an entry for the studio, ordered by title. Read at request time. */
export async function listGuidesForStudio(studioId: string): Promise<GuideLinkDto[]> {
  const guides = await getDependencies().guides.listPublished();
  return guides
    .filter((guide) => guide.entries.some((entry) => entry.kind === 'studio' && entry.locationId === studioId))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(({ slug, title }) => ({ slug, title }));
}
