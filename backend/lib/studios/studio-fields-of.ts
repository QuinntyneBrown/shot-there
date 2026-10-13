import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';

type StudioFields = Omit<
  StudioRecord,
  'id' | 'slug' | 'status' | 'priceVerifiedAt' | 'ogImageUrl' | 'publishedAt' | 'updatedAt' | 'images'
>;

/** The studio's stored fields from the editor's save body. */
export function studioFieldsOf(input: StudioInput): StudioFields {
  return {
    name: input.name,
    neighbourhood: input.neighbourhood,
    addressOrCrossStreets: input.addressOrCrossStreets,
    bookingUrl: input.bookingUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    hourlyRate: input.hourlyRate,
    minBookingHours: input.minBookingHours,
    fees: input.fees,
    usableWidthM: input.usableWidth,
    usableDepthM: input.usableDepth,
    ceilingHeightM: input.ceilingHeight,
    windowDirection: input.windowDirection,
    lightMorning: input.naturalLight.morning,
    lightMidday: input.naturalLight.midday,
    lightAfternoon: input.naturalLight.afternoon,
    lightEvening: input.naturalLight.evening,
    outletCount: input.outletCount,
    outletType: input.outletType,
    has20ACircuits: input.has20aCircuits,
    hasCycWall: input.hasCycWall,
    cycWallCondition: input.cycWallCondition,
    backdrops: input.backdrops,
    gear: input.gear,
    loadIn: input.loadIn,
    loadInNote: input.loadInNote,
    parking: input.parking,
    transit: input.transit,
    washroom: input.washroom,
    changingArea: input.changingArea,
    clientSeating: input.clientSeating,
    noise: input.noise,
    whoItsFor: input.whoItsFor,
    whoShouldSkip: input.whoShouldSkip,
    scoreValue: input.scores.value,
    scoreLight: input.scores.light,
    scoreSpace: input.scores.space,
    scoreGear: input.scores.gear,
    scoreLogistics: input.scores.logistics,
    scoreCondition: input.scores.condition,
    disclosure: input.disclosure,
    disclosureProvider: input.disclosureProvider,
    videoId: input.videoLink,
    episodeTitle: input.episodeTitle,
  };
}
