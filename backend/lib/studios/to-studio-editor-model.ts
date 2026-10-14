import { attachedWithRole } from '@/lib/images/attached-with-role';
import { toImageDto } from '@/lib/images/to-image-dto';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioEditorModel } from '@/lib/studios/studio-editor-model';
import type { StudioRecord } from '@/lib/studios/studio-record';

export function toStudioEditorModel(studio: StudioRecord): StudioEditorModel {
  return {
    id: studio.id,
    slug: studio.slug,
    status: studio.status,
    publishedAt: studio.publishedAt?.toISOString() ?? null,
    updatedAt: studio.updatedAt.toISOString(),
    name: studio.name,
    neighbourhood: studio.neighbourhood,
    addressOrCrossStreets: studio.addressOrCrossStreets,
    bookingUrl: studio.bookingUrl,
    latitude: studio.latitude,
    longitude: studio.longitude,
    hourlyRate: studio.hourlyRate,
    minBookingHours: studio.minBookingHours,
    fees: studio.fees,
    priceVerifiedAt: studio.priceVerifiedAt,
    usableWidth: studio.usableWidthM,
    usableDepth: studio.usableDepthM,
    ceilingHeight: studio.ceilingHeightM,
    windowDirection: studio.windowDirection,
    naturalLight: {
      morning: studio.lightMorning,
      midday: studio.lightMidday,
      afternoon: studio.lightAfternoon,
      evening: studio.lightEvening,
    },
    outletCount: studio.outletCount,
    outletType: studio.outletType,
    has20aCircuits: studio.has20ACircuits,
    hasCycWall: studio.hasCycWall,
    cycWallCondition: studio.cycWallCondition,
    backdrops: studio.backdrops,
    gear: studio.gear,
    loadIn: studio.loadIn,
    loadInNote: studio.loadInNote,
    parking: studio.parking,
    transit: studio.transit,
    washroom: studio.washroom,
    changingArea: studio.changingArea,
    clientSeating: studio.clientSeating,
    noise: studio.noise,
    scores: rubricScoresOf(studio),
    whoItsFor: studio.whoItsFor,
    whoShouldSkip: studio.whoShouldSkip,
    disclosure: studio.disclosure,
    disclosureProvider: studio.disclosureProvider,
    videoLink: studio.videoId,
    episodeTitle: studio.episodeTitle,
    testShots: attachedWithRole(studio.images, 'test_shot').map((image) => ({
      imageId: image.id,
      alt: image.altText,
      caption: image.caption ?? '',
      preview: toImageDto(image),
    })),
    gallery: attachedWithRole(studio.images, 'gallery').map((image) => ({
      imageId: image.id,
      alt: image.altText,
      preview: toImageDto(image),
    })),
  };
}
