import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole, toImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { findNearestStudios } from '@/lib/spots/find-nearest-studios';
import type { Season } from '@/lib/spots/season';
import type { ShootType } from '@/lib/spots/shoot-type';
import type { SpotDetailDto } from '@/lib/spots/spot-detail-dto';
import type { TimeOfDay } from '@/lib/spots/time-of-day';

const TIME_ORDER: TimeOfDay[] = ['morning', 'midday', 'afternoon', 'goldenHour', 'blueHour'];
const SEASON_ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const SHOOT_TYPE_ORDER: ShootType[] = ['portrait', 'weddingEngagement', 'commercial', 'video'];

/** The published spot with the slug, or null. Drafts are never returned. */
export async function getSpot(slug: string): Promise<SpotDetailDto | null> {
  const { spots, clock } = getDependencies();
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
    // A sample shot is public once saved with its lens and angle note.
    sampleShots: imagesWithRole(spot.images, 'sample_shot').flatMap((image) =>
      image.focalLengthMm !== null && image.angleNote !== null
        ? [{ image: toImageDto(image), focalLengthMm: image.focalLengthMm, angleNote: image.angleNote }]
        : [],
    ),
    conditions: {
      weekdayCrowds: spot.weekdayCrowds,
      weekendCrowds: spot.weekendCrowds,
      parking: spot.parking,
      washrooms: spot.washrooms,
      changing: spot.changing,
    },
    permits: {
      rows: [...spot.permits].sort(
        (a, b) => SHOOT_TYPE_ORDER.indexOf(a.shootType) - SHOOT_TYPE_ORDER.indexOf(b.shootType),
      ),
      sourceUrl: spot.permitSourceUrl,
      verifiedOn: spot.permitVerifiedAt,
      permitStale: isStale(spot.permitVerifiedAt, clock.today()),
    },
    bestUses: spot.bestUses,
    disclosure: { kind: spot.disclosure, provider: spot.disclosureProvider },
    videoId: spot.videoId,
    rainBackup:
      spot.latitude !== null && spot.longitude !== null ? await findNearestStudios(spot.latitude, spot.longitude) : [],
  };
}
