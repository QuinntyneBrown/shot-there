import { getDependencies } from '@/lib/data/dependency-container';
import type { SitemapEntryDto } from '@/lib/seo/sitemap-entry-dto';

interface PublishedItem {
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date;
}

/** One entry per published studio, spot and guide plus the list pages, map and guides index. Never drafts. */
export async function listSitemapEntries(): Promise<SitemapEntryDto[]> {
  const { studios, spots, guides, clock } = getDependencies();
  const [publishedStudios, publishedSpots, publishedGuides] = await Promise.all([
    studios.listPublished(),
    spots.listPublished(),
    guides.listPublished(),
  ]);
  const itemEntries = (base: string, items: PublishedItem[]) =>
    items.map((item) => ({ path: `${base}/${item.slug}`, lastModified: lastModifiedOf(item) }));
  // A list page changes with the newest publish of its items; with none published, it is dated now.
  const latestOf = (items: PublishedItem[]) => items.map(lastModifiedOf).sort().at(-1) ?? clock.now().toISOString();
  return [
    ...itemEntries('/studios', publishedStudios),
    ...itemEntries('/spots', publishedSpots),
    ...itemEntries('/guides', publishedGuides),
    { path: '/studios', lastModified: latestOf(publishedStudios) },
    { path: '/spots', lastModified: latestOf(publishedSpots) },
    { path: '/map', lastModified: latestOf([...publishedStudios, ...publishedSpots]) },
    { path: '/guides', lastModified: latestOf(publishedGuides) },
  ];
}

function lastModifiedOf(item: PublishedItem): string {
  return (item.publishedAt ?? item.updatedAt).toISOString();
}
