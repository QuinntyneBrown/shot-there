import { imagesWithRole } from '@/lib/images/to-image-dto';
import type { ShootType } from '@/lib/spots/shoot-type';
import type { Season } from '@/lib/spots/season';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { TimeOfDay } from '@/lib/spots/time-of-day';
import type { StudioRecord } from '@/lib/studios/studio-record';

const present = (value: unknown) => value !== null && value !== undefined && value !== '';

function missing(checks: [key: string, ok: boolean][]): string[] {
  return checks.filter(([, ok]) => !ok).map(([key]) => key);
}

/**
 * The studio's missing standard-data-set keys (L2-002, ICD §15.5), in that order; empty when it can be published. A
 * required image list counts only images that are shown publicly.
 */
export function checkStudioPublishable(studio: StudioRecord): string[] {
  return missing([
    ['name', present(studio.name)],
    ['neighbourhood', present(studio.neighbourhood)],
    ['addressOrCrossStreets', present(studio.addressOrCrossStreets)],
    ['bookingUrl', present(studio.bookingUrl)],
    ['hourlyRate', present(studio.hourlyRate)],
    ['minBookingHours', present(studio.minBookingHours)],
    ['priceVerifiedAt', present(studio.priceVerifiedAt)],
    ['usableWidth', present(studio.usableWidthM)],
    ['usableDepth', present(studio.usableDepthM)],
    ['ceilingHeight', present(studio.ceilingHeightM)],
    ['windowDirection', present(studio.windowDirection)],
    ['naturalLight.morning', present(studio.lightMorning)],
    ['naturalLight.midday', present(studio.lightMidday)],
    ['naturalLight.afternoon', present(studio.lightAfternoon)],
    ['naturalLight.evening', present(studio.lightEvening)],
    ['outletCount', present(studio.outletCount)],
    ['outletType', present(studio.outletType)],
    ['has20aCircuits', present(studio.has20ACircuits)],
    ['hasCycWall', present(studio.hasCycWall)],
    ['testShots', imagesWithRole(studio.images, 'test_shot').length > 0],
    ['gallery', imagesWithRole(studio.images, 'gallery').length > 0],
    ['scores.value', present(studio.scoreValue)],
    ['scores.light', present(studio.scoreLight)],
    ['scores.space', present(studio.scoreSpace)],
    ['scores.gear', present(studio.scoreGear)],
    ['scores.logistics', present(studio.scoreLogistics)],
    ['scores.condition', present(studio.scoreCondition)],
    ['whoItsFor', present(studio.whoItsFor)],
    ['whoShouldSkip', present(studio.whoShouldSkip)],
    ['disclosure', present(studio.disclosure)],
  ]);
}

const TIMES: TimeOfDay[] = ['morning', 'midday', 'afternoon', 'goldenHour', 'blueHour'];
const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const SHOOT_TYPES: ShootType[] = ['portrait', 'weddingEngagement', 'commercial', 'video'];

/** The spot's missing standard-data-set keys (L2-002, ICD §15.5), in that order; empty when it can be published. */
export function checkSpotPublishable(spot: SpotRecord): string[] {
  const sampleShots = imagesWithRole(spot.images, 'sample_shot').filter(
    (image) => image.focalLengthMm !== null && image.angleNote !== null,
  );
  return missing([
    ['name', present(spot.name)],
    ['neighbourhood', present(spot.neighbourhood)],
    ['latitude', present(spot.latitude)],
    ['longitude', present(spot.longitude)],
    ['directions', present(spot.directions)],
    ...TIMES.map((time): [string, boolean] => [
      `lightByTime.${time}`,
      spot.lightByTime.some((row) => row.timeOfDay === time),
    ]),
    ...SEASONS.map((season): [string, boolean] => [
      `lightBySeason.${season}`,
      spot.lightBySeason.some((row) => row.season === season && present(row.note)),
    ]),
    ['sampleShots', sampleShots.length > 0],
    ...SHOOT_TYPES.map((shootType): [string, boolean] => [
      `permits.${shootType}`,
      spot.permits.some((row) => row.shootType === shootType),
    ]),
    ['permitSourceUrl', present(spot.permitSourceUrl)],
    ['permitVerifiedAt', present(spot.permitVerifiedAt)],
    ['bestUses', spot.bestUses.length > 0],
    ['disclosure', present(spot.disclosure)],
  ]);
}
