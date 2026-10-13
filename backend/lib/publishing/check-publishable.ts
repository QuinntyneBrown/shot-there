import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';

const present = (value: unknown) => value !== null && value !== undefined && value !== '';
const allPresent = (...values: unknown[]) => values.every(present);

function missing(checks: [key: string, ok: boolean][]): string[] {
  return checks.filter(([, ok]) => !ok).map(([key]) => key);
}

function disclosureChecks(location: StudioRecord | SpotRecord): [string, boolean][] {
  const needsProvider = location.disclosure === 'discounted' || location.disclosure === 'comped';
  return [
    ['disclosure', present(location.disclosure)],
    ['disclosureProvider', !needsProvider || present(location.disclosureProvider)],
  ];
}

/** The studio's missing standard-data-set fields (L2-002), in editor order; empty when it can be published. */
export function checkStudioPublishable(studio: StudioRecord): string[] {
  const hasImage = (role: string) => studio.images.some((image) => image.role === role);
  return missing([
    ['name', present(studio.name)],
    ['neighbourhood', present(studio.neighbourhood)],
    ['addressOrCrossStreets', present(studio.addressOrCrossStreets)],
    ['bookingUrl', present(studio.bookingUrl)],
    ['hourlyRate', present(studio.hourlyRate)],
    ['minBookingHours', present(studio.minBookingHours)],
    ['priceVerifiedAt', present(studio.priceVerifiedAt)],
    ['usableSpace', allPresent(studio.usableWidthM, studio.usableDepthM)],
    ['ceilingHeight', present(studio.ceilingHeightM)],
    ['windowDirection', present(studio.windowDirection)],
    ['naturalLight', allPresent(studio.lightMorning, studio.lightMidday, studio.lightAfternoon, studio.lightEvening)],
    ['power', allPresent(studio.outletCount, studio.outletType, studio.has20ACircuits)],
    ['cycWall', present(studio.hasCycWall)],
    ['testShots', hasImage('testShot')],
    ['gallery', hasImage('gallery')],
    [
      'scores',
      allPresent(
        studio.scoreValue,
        studio.scoreLight,
        studio.scoreSpace,
        studio.scoreGear,
        studio.scoreLogistics,
        studio.scoreCondition,
      ),
    ],
    ['verdict', allPresent(studio.whoItsFor, studio.whoShouldSkip)],
    ...disclosureChecks(studio),
  ]);
}

/** The spot's missing standard-data-set fields (L2-002), in editor order; empty when it can be published. */
export function checkSpotPublishable(spot: SpotRecord): string[] {
  return missing([
    ['name', present(spot.name)],
    ['neighbourhood', present(spot.neighbourhood)],
    ['coordinates', allPresent(spot.latitude, spot.longitude)],
    ['directions', present(spot.directions)],
    ['lightByTime', spot.lightByTime.length > 0],
    ['lightBySeason', spot.lightBySeason.length > 0],
    ['sampleShots', spot.images.some((image) => image.role === 'sampleShot')],
    ['permitStatus', spot.permits.length > 0],
    ['permitSourceUrl', present(spot.permitSourceUrl)],
    ['permitVerifiedAt', present(spot.permitVerifiedAt)],
    ['bestUses', spot.bestUses.length > 0],
    ...disclosureChecks(spot),
  ]);
}
