import { getDependencies } from '@/lib/data/dependency-container';
import type { SpotRecord } from '@/lib/spots/spot-record';

/** A complete ICD `SpotInput` as the editor sends it for a new spot: every property present, no images yet. */
export function aSpotInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'Riverdale Park East',
    neighbourhood: 'Riverdale',
    type: 'park',
    latitude: 43.6703,
    longitude: -79.3542,
    directions: 'Walk east from Broadview station.',
    lightByTime: {
      morning: { rating: 'medium', note: null },
      midday: { rating: 'low', note: null },
      afternoon: { rating: 'medium', note: null },
      goldenHour: { rating: 'strong', note: 'Skyline glows' },
      blueHour: { rating: 'medium', note: null },
    },
    lightBySeason: {
      spring: 'Blossoms along the path',
      summer: 'Full canopy',
      autumn: 'Leaves turn in mid-October',
      winter: 'Bare trees, open skyline',
    },
    weekdayCrowds: 'low',
    weekendCrowds: 'high',
    parking: 'Street parking on Broadview',
    washrooms: null,
    changing: null,
    permits: { portrait: 'not_required', weddingEngagement: 'not_required', commercial: 'required', video: 'required' },
    permitSourceUrl: 'https://www.toronto.ca/permits',
    bestUses: ['engagement', 'portrait'],
    disclosure: 'paid_in_full',
    disclosureProvider: null,
    videoLink: null,
    episodeTitle: null,
    sampleShots: [],
    ...overrides,
  };
}

/** A complete `SpotInput` for saving an existing spot: its sample shots name exactly the spot's attached images. */
export function aSpotInputFor(spot: SpotRecord, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const sampleShots = spot.images
    .filter((image) => image.role === 'sample_shot')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => ({
      imageId: image.id,
      alt: image.altText || 'Sample shot',
      focalLengthMm: image.focalLengthMm ?? 50,
      angleNote: image.angleNote ?? 'Eye level',
    }));
  return aSpotInput({ sampleShots, ...overrides });
}

/** The save body for the stored spot with the id, as the editor would send it after opening it, with the overrides. */
export async function spotSaveBody(id: string, overrides: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const spot = await getDependencies().spots.findById(id);
  return spot ? aSpotInputFor(spot, overrides) : aSpotInput(overrides);
}
