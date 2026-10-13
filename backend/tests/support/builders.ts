import type { GuideRecord } from '@/lib/guides/guide-record';
import type { ImageRecord } from '@/lib/images/image-record';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';

let sequence = 0;
const nextId = () => `id-${++sequence}`;

/** An image with all four JPEG/WebP/AVIF variants. */
export function anImage(overrides: Partial<ImageRecord> = {}): ImageRecord {
  const id = overrides.id ?? nextId();
  return {
    id,
    role: 'gallery',
    sortOrder: 0,
    altText: `Image ${id}`,
    caption: null,
    focalLengthMm: null,
    angleNote: null,
    width: 2048,
    height: 1365,
    storageKey: `images/${id}/original`,
    contentType: 'image/jpeg',
    originalName: `${id}.jpg`,
    variants: [480, 960, 1440, 2048].flatMap((width) =>
      (['avif', 'webp', 'jpeg'] as const).map((format) => ({
        width,
        format,
        storageKey: `images/${id}/${width}.${format === 'jpeg' ? 'jpg' : format}`,
        url: `https://cdn.example/images/${id}/${width}.${format === 'jpeg' ? 'jpg' : format}`,
      })),
    ),
    ...overrides,
  };
}

/** A published studio with every standard field present. */
export function aStudio(overrides: Partial<StudioRecord> = {}): StudioRecord {
  const id = overrides.id ?? nextId();
  return {
    id,
    slug: `studio-${id}`,
    status: 'published',
    name: `Studio ${id}`,
    neighbourhood: 'Leslieville',
    addressOrCrossStreets: 'Queen St E & Logan Ave',
    bookingUrl: 'https://studio.example/book',
    latitude: 43.6629,
    longitude: -79.3368,
    hourlyRate: 60,
    minBookingHours: 2,
    priceVerifiedAt: '2026-09-01',
    usableWidthM: 6.1,
    usableDepthM: 4.3,
    ceilingHeightM: 3.4,
    windowDirection: 'North',
    lightMorning: 'medium',
    lightMidday: 'strong',
    lightAfternoon: 'medium',
    lightEvening: 'low',
    outletCount: 8,
    outletType: '15A household',
    has20ACircuits: false,
    hasCycWall: false,
    cycWallCondition: null,
    backdrops: 'White, grey and black seamless',
    loadIn: 'elevator',
    loadInNote: null,
    parking: 'street',
    parkingNote: null,
    transit: '501 Queen streetcar',
    washroom: 'Private',
    changingArea: 'Curtained corner',
    clientSeating: 'Sofa for 3',
    noise: 'Quiet',
    whoItsFor: 'Portrait photographers who want soft north light.',
    whoShouldSkip: 'Crews over six people.',
    scoreValue: 4,
    scoreLight: 4,
    scoreSpace: 3,
    scoreGear: 3,
    scoreLogistics: 4,
    scoreCondition: 4,
    disclosure: 'paid_in_full',
    disclosureProvider: null,
    videoId: null,
    episodeTitle: null,
    ogImageUrl: null,
    publishedAt: new Date('2026-09-02T12:00:00Z'),
    updatedAt: new Date('2026-09-02T12:00:00Z'),
    fees: [],
    gear: [],
    images: [anImage({ role: 'test_shot' }), anImage({ role: 'gallery' })],
    ...overrides,
  };
}

/** A published outdoor spot with every standard field present. */
export function aSpot(overrides: Partial<SpotRecord> = {}): SpotRecord {
  const id = overrides.id ?? nextId();
  return {
    id,
    slug: `spot-${id}`,
    status: 'published',
    name: `Spot ${id}`,
    neighbourhood: 'Riverdale',
    type: 'park',
    latitude: 43.6703,
    longitude: -79.3542,
    directions: 'Walk east from Broadview station.',
    lightByTime: [
      { timeOfDay: 'morning', rating: 'medium', note: null },
      { timeOfDay: 'midday', rating: 'low', note: null },
      { timeOfDay: 'afternoon', rating: 'medium', note: null },
      { timeOfDay: 'goldenHour', rating: 'strong', note: null },
      { timeOfDay: 'blueHour', rating: 'medium', note: null },
    ],
    lightBySeason: [
      { season: 'spring', note: null },
      { season: 'summer', note: null },
      { season: 'autumn', note: null },
      { season: 'winter', note: null },
    ],
    weekdayCrowds: 'low',
    weekendCrowds: 'medium',
    parking: 'Street parking on Broadview',
    washrooms: null,
    changing: null,
    permits: [
      { shootType: 'portrait', required: false },
      { shootType: 'weddingEngagement', required: false },
      { shootType: 'commercial', required: true },
      { shootType: 'video', required: true },
    ],
    permitSourceUrl: 'https://www.toronto.ca/permits',
    permitVerifiedAt: '2026-09-01',
    bestUses: ['portrait'],
    disclosure: 'paid_in_full',
    disclosureProvider: null,
    videoId: null,
    publishedAt: new Date('2026-09-02T12:00:00Z'),
    updatedAt: new Date('2026-09-02T12:00:00Z'),
    images: [anImage({ role: 'sample_shot', focalLengthMm: 85, angleNote: 'From the lower steps' })],
    ...overrides,
  };
}

/** A published guide with no entries. */
export function aGuide(overrides: Partial<GuideRecord> = {}): GuideRecord {
  const id = overrides.id ?? nextId();
  return {
    id,
    slug: `guide-${id}`,
    status: 'published',
    title: `Guide ${id}`,
    introduction: 'Studios we have shot in and would book again.',
    publishedAt: new Date('2026-09-05T12:00:00Z'),
    updatedAt: new Date('2026-09-05T12:00:00Z'),
    entries: [],
    ...overrides,
  };
}
