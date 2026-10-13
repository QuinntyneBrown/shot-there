import { getDependencies } from '@/lib/data/dependency-container';
import type { PublicRoutesDto } from '@/lib/publishing/public-routes-dto';

export async function listPublicRoutes(): Promise<PublicRoutesDto> {
  const { studios, spots, guides } = getDependencies();
  const [publishedStudios, publishedSpots, publishedGuides] = await Promise.all([
    studios.listPublished(),
    spots.listPublished(),
    guides.listPublished(),
  ]);
  return {
    studios: publishedStudios.map((studio) => studio.slug),
    spots: publishedSpots.map((spot) => spot.slug),
    guides: publishedGuides.map((guide) => guide.slug),
  };
}
