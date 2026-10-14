import { getDependencies } from '@/lib/data/dependency-container';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** A complete ICD `StudioInput` as the editor sends it for a new studio: every property present, no images yet. */
export function aStudioInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'The Junction Loft',
    neighbourhood: 'The Junction',
    addressOrCrossStreets: 'Dundas St W & Keele St',
    bookingUrl: 'https://junctionloft.example/book',
    latitude: 43.665,
    longitude: -79.464,
    hourlyRate: 60,
    minBookingHours: 2,
    fees: [{ name: 'Cleaning', amount: 25, mandatory: true }],
    usableWidth: 6.1,
    usableDepth: 4.3,
    ceilingHeight: 3.4,
    windowDirection: 'North',
    naturalLight: { morning: 'medium', midday: 'strong', afternoon: 'medium', evening: 'low' },
    outletCount: 8,
    outletType: '15A household',
    has20aCircuits: false,
    hasCycWall: true,
    cycWallCondition: 'scuffed',
    backdrops: ['White seamless'],
    gear: [{ name: 'Profoto B10', category: 'lights', quantity: 2, included: true, extraCost: null }],
    loadIn: 'freight_elevator',
    loadInNote: 'small, 1.2 m wide',
    parking: 'street',
    transit: '505 Dundas streetcar',
    washroom: 'Private',
    changingArea: null,
    clientSeating: 'Sofa for 3',
    noise: 'Quiet',
    scores: { value: 4, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 },
    whoItsFor: 'Portrait photographers.',
    whoShouldSkip: 'Large crews.',
    disclosure: 'paid_in_full',
    disclosureProvider: null,
    videoLink: null,
    episodeTitle: null,
    testShots: [],
    gallery: [],
    ...overrides,
  };
}

/** A complete `StudioInput` for saving an existing studio: its image lists name exactly the studio's attached images. */
export function aStudioInputFor(studio: StudioRecord, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const withRole = (role: string) =>
    studio.images.filter((image) => image.role === role).sort((a, b) => a.sortOrder - b.sortOrder);
  return aStudioInput({
    testShots: withRole('test_shot').map((image) => ({
      imageId: image.id,
      alt: image.altText || 'Test shot',
      caption: image.caption ?? 'Standard setup',
    })),
    gallery: withRole('gallery').map((image) => ({ imageId: image.id, alt: image.altText || 'Gallery image' })),
    ...overrides,
  });
}

/** The save body for the stored studio with the id, as the editor would send it after opening it, with the overrides. */
export async function studioSaveBody(id: string, overrides: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const studio = await getDependencies().studios.findById(id);
  return studio ? aStudioInputFor(studio, overrides) : aStudioInput(overrides);
}
