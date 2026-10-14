import { attachedWithRole } from '@/lib/images/attached-with-role';
import { toImageDto } from '@/lib/images/to-image-dto';
import type { ShootType } from '@/lib/spots/shoot-type';
import type { Season } from '@/lib/spots/season';
import type { SpotEditorModel } from '@/lib/spots/spot-editor-model';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { TimeOfDay } from '@/lib/spots/time-of-day';

export function toSpotEditorModel(spot: SpotRecord): SpotEditorModel {
  const slot = (timeOfDay: TimeOfDay) => {
    const row = spot.lightByTime.find((candidate) => candidate.timeOfDay === timeOfDay);
    return { rating: row?.rating ?? null, note: row?.note ?? null };
  };
  const season = (name: Season) => spot.lightBySeason.find((row) => row.season === name)?.note ?? null;
  const permit = (shootType: ShootType) => {
    const row = spot.permits.find((candidate) => candidate.shootType === shootType);
    return row ? (row.required ? 'required' : 'not_required') : null;
  };

  return {
    id: spot.id,
    slug: spot.slug,
    status: spot.status,
    publishedAt: spot.publishedAt?.toISOString() ?? null,
    updatedAt: spot.updatedAt.toISOString(),
    name: spot.name,
    neighbourhood: spot.neighbourhood,
    type: spot.type,
    latitude: spot.latitude,
    longitude: spot.longitude,
    directions: spot.directions,
    lightByTime: {
      morning: slot('morning'),
      midday: slot('midday'),
      afternoon: slot('afternoon'),
      goldenHour: slot('goldenHour'),
      blueHour: slot('blueHour'),
    },
    lightBySeason: { spring: season('spring'), summer: season('summer'), autumn: season('autumn'), winter: season('winter') },
    weekdayCrowds: spot.weekdayCrowds,
    weekendCrowds: spot.weekendCrowds,
    parking: spot.parking,
    washrooms: spot.washrooms,
    changing: spot.changing,
    permits: {
      portrait: permit('portrait'),
      weddingEngagement: permit('weddingEngagement'),
      commercial: permit('commercial'),
      video: permit('video'),
    },
    permitSourceUrl: spot.permitSourceUrl,
    permitVerifiedAt: spot.permitVerifiedAt,
    bestUses: spot.bestUses,
    disclosure: spot.disclosure,
    disclosureProvider: spot.disclosureProvider,
    videoLink: spot.videoId,
    episodeTitle: spot.episodeTitle,
    sampleShots: attachedWithRole(spot.images, 'sample_shot').map((image) => ({
      imageId: image.id,
      alt: image.altText,
      focalLengthMm: image.focalLengthMm,
      angleNote: image.angleNote,
      preview: toImageDto(image),
    })),
  };
}
