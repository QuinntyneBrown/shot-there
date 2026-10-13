import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole, toImageDto } from '@/lib/images/to-image-dto';
import type { Season } from '@/lib/spots/season';
import type { SpotDetailDto } from '@/lib/spots/spot-detail-dto';
import type { TimeOfDay } from '@/lib/spots/time-of-day';

const TIME_ORDER: TimeOfDay[] = ['morning', 'midday', 'afternoon', 'goldenHour', 'blueHour'];
const SEASON_ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];

/** The published spot with the slug, or null. Drafts are never returned. */
export async function getSpot(slug: string): Promise<SpotDetailDto | null> {
  const { spots } = getDependencies();
  const spot = await spots.findPublishedBySlug(slug);
  if (!spot) return null;

  return {
    slug: spot.slug,
    name: spot.name,
    neighbourhood: spot.neighbourhood,
    latitude: spot.latitude,
    longitude: spot.longitude,
    directions: spot.directions,
    lightByTime: [...spot.lightByTime].sort(
      (a, b) => TIME_ORDER.indexOf(a.timeOfDay) - TIME_ORDER.indexOf(b.timeOfDay),
    ),
    lightBySeason: [...spot.lightBySeason].sort(
      (a, b) => SEASON_ORDER.indexOf(a.season) - SEASON_ORDER.indexOf(b.season),
    ),
    sampleShots: imagesWithRole(spot.images, 'sampleShot').map((image) => ({
      ...toImageDto(image),
      focalLengthMm: image.focalLengthMm,
      angleNote: image.angleNote,
    })),
  };
}
