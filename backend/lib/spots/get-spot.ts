import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole, toImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { present } from '@/lib/shared/present';
import { findNearestStudios } from '@/lib/spots/find-nearest-studios';
import { inBestUseOrder } from '@/lib/spots/in-best-use-order';
import type { LightSlotDto } from '@/lib/spots/light-slot-dto';
import type { Season } from '@/lib/spots/season';
import type { SpotDetailDto } from '@/lib/spots/spot-detail-dto';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { TimeOfDay } from '@/lib/spots/time-of-day';
import { toPermitsByShootType } from '@/lib/spots/to-permits-by-shoot-type';

/** The published spot with the slug, or null. Drafts are never returned. */
export async function getSpot(slug: string): Promise<SpotDetailDto | null> {
  const { spots, clock } = getDependencies();
  const spot = await spots.findPublishedBySlug(slug);
  if (!spot) return null;

  const latitude = present(spot.latitude, 'latitude');
  const longitude = present(spot.longitude, 'longitude');
  const lightAt = (timeOfDay: TimeOfDay): LightSlotDto => {
    const slot = present(spot.lightByTime.find((row) => row.timeOfDay === timeOfDay) ?? null, `lightByTime.${timeOfDay}`);
    return { rating: slot.rating, note: slot.note };
  };
  const lightIn = (season: Season) =>
    present(spot.lightBySeason.find((row) => row.season === season)?.note ?? null, `lightBySeason.${season}`);

  return {
    slug: spot.slug,
    name: spot.name,
    neighbourhood: present(spot.neighbourhood, 'neighbourhood'),
    type: spot.type,
    latitude,
    longitude,
    directions: present(spot.directions, 'directions'),
    lightByTime: {
      morning: lightAt('morning'),
      midday: lightAt('midday'),
      afternoon: lightAt('afternoon'),
      goldenHour: lightAt('goldenHour'),
      blueHour: lightAt('blueHour'),
    },
    lightBySeason: {
      spring: lightIn('spring'),
      summer: lightIn('summer'),
      autumn: lightIn('autumn'),
      winter: lightIn('winter'),
    },
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
      byShootType: present(toPermitsByShootType(spot.permits), 'permits'),
      sourceUrl: present(spot.permitSourceUrl, 'permitSourceUrl'),
      verifiedAt: spot.permitVerifiedAt,
      permitStale: isStale(spot.permitVerifiedAt, clock.today()),
    },
    bestUses: inBestUseOrder(spot.bestUses),
    disclosure: { kind: present(spot.disclosure, 'disclosure'), provider: spot.disclosureProvider },
    episode: episodeOf(spot),
    rainBackup: await findNearestStudios(latitude, longitude),
    reviewedAt: present(spot.publishedAt, 'publishedAt').toISOString(),
  };
}

function episodeOf(spot: SpotRecord) {
  return spot.videoId ? { videoId: spot.videoId, title: spot.episodeTitle ?? spot.name } : null;
}
