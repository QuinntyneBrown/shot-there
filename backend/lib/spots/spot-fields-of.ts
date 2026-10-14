import type { ShootType } from '@/lib/spots/shoot-type';
import type { Season } from '@/lib/spots/season';
import type { SpotInput } from '@/lib/spots/spot-input';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { TimeOfDay } from '@/lib/spots/time-of-day';

type SpotFields = Omit<SpotRecord, 'id' | 'slug' | 'status' | 'permitVerifiedAt' | 'publishedAt' | 'updatedAt' | 'images'>;

const TIMES: TimeOfDay[] = ['morning', 'midday', 'afternoon', 'goldenHour', 'blueHour'];
const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const SHOOT_TYPES: ShootType[] = ['portrait', 'weddingEngagement', 'commercial', 'video'];

/** The spot's stored fields from the editor's save body; empty light slots, seasons and permits are not stored. */
export function spotFieldsOf(input: SpotInput): SpotFields {
  return {
    name: input.name,
    neighbourhood: input.neighbourhood,
    type: input.type,
    latitude: input.latitude,
    longitude: input.longitude,
    directions: input.directions,
    lightByTime: TIMES.flatMap((timeOfDay) => {
      const { rating, note } = input.lightByTime[timeOfDay];
      return rating === null ? [] : [{ timeOfDay, rating, note }];
    }),
    lightBySeason: SEASONS.flatMap((season) => {
      const note = input.lightBySeason[season];
      return note === null ? [] : [{ season, note }];
    }),
    weekdayCrowds: input.weekdayCrowds,
    weekendCrowds: input.weekendCrowds,
    parking: input.parking,
    washrooms: input.washrooms,
    changing: input.changing,
    permits: SHOOT_TYPES.flatMap((shootType) => {
      const requirement = input.permits[shootType];
      return requirement === null ? [] : [{ shootType, required: requirement === 'required' }];
    }),
    permitSourceUrl: input.permitSourceUrl,
    bestUses: input.bestUses,
    disclosure: input.disclosure,
    disclosureProvider: input.disclosureProvider,
    videoId: input.videoLink,
    episodeTitle: input.episodeTitle,
  };
}
