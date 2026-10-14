import { getDependencies } from '@/lib/data/dependency-container';
import type { PublicRoutesDto } from '@/lib/publishing/public-routes-dto';

/** The published slugs per content type, each list by slug (ICD E10). */
export async function listPublicRoutes(): Promise<PublicRoutesDto> {
  const { studios, spots, guides } = getDependencies();
  const [publishedStudios, publishedSpots, publishedGuides] = await Promise.all([
    studios.listPublished(),
    spots.listPublished(),
    guides.listPublished(),
  ]);
  const slugs = (items: { slug: string }[]) => items.map((item) => item.slug).sort();
  return { studios: slugs(publishedStudios), spots: slugs(publishedSpots), guides: slugs(publishedGuides) };
}
