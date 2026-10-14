import { z } from 'zod';
import {
  boundedNumber,
  nullableEnum,
  nullableNumber,
  nullableText,
  nullableUrl,
  pastOrTodayDate,
  requireBothCoordinates,
  requiredText,
  slugField,
  uniqueBy,
} from '@/lib/http/input-fields';
import type { BestUse } from '@/lib/spots/best-use';
import type { SpotListQuery } from '@/lib/spots/spot-list-query';
import type { SpotType } from '@/lib/spots/spot-type';
import { videoIdField } from '@/lib/videos/schemas';
import { requireDisclosureProvider } from '@/lib/publishing/schemas';

const TYPE_VALUES: Record<string, SpotType> = {
  park: 'park',
  architecture: 'architecture',
  waterfront: 'waterfront',
  indoor_public: 'indoor_public',
};
const USE_VALUES: BestUse[] = ['engagement', 'family', 'portrait', 'brand', 'video'];

/** Lenient: unknown values are dropped; parsing never fails. */
export const spotListQuerySchema = z.object({
  types: z.array(z.string()).transform((values) => values.flatMap((value) => TYPE_VALUES[value] ?? [])),
  useCases: z
    .array(z.string())
    .transform((values) => values.filter((value): value is BestUse => (USE_VALUES as string[]).includes(value))),
  permit: z.enum(['none_needed', 'any']).catch('any'),
});

export function parseSpotListQuery(searchParams: URLSearchParams): SpotListQuery {
  return spotListQuerySchema.parse({
    types: searchParams.getAll('type'),
    useCases: searchParams.getAll('use'),
    permit: searchParams.get('permit') ?? undefined,
  });
}

const SPOT_TYPES = ['park', 'architecture', 'waterfront', 'indoor_public'] as const;
const BEST_USES = ['engagement', 'family', 'portrait', 'brand', 'video'] as const;
const CROWDS = ['low', 'medium', 'high'] as const;
const PERMIT = ['required', 'not_required'] as const;

const lightSlot = z.strictObject({
  rating: nullableEnum(['none', 'low', 'medium', 'strong']),
  note: nullableText(200),
});

const sampleShotOrderItem = z.strictObject({
  imageId: z.string({ error: 'Choose an image' }).min(1, { error: 'Choose an image' }).max(64),
  alt: requiredText('Describe this image', 300),
  focalLengthMm: boundedNumber({ min: 1, max: 2000, integer: true }),
  angleNote: requiredText('Describe the angle', 200),
});

/** The owner's spot save body (ICD §13.11, §15.2). Strict: every property present, unknown ones refused. */
export const spotInputSchema = (today: string) =>
  z
    .strictObject({
      name: requiredText('Enter a name', 120),
      slug: slugField().optional(),
      neighbourhood: nullableText(80),
      type: nullableEnum(SPOT_TYPES),
      latitude: nullableNumber({ min: -90, max: 90 }),
      longitude: nullableNumber({ min: -180, max: 180 }),
      directions: nullableText(4000),
      lightByTime: z.strictObject({
        morning: lightSlot,
        midday: lightSlot,
        afternoon: lightSlot,
        goldenHour: lightSlot,
        blueHour: lightSlot,
      }),
      lightBySeason: z.strictObject({
        spring: nullableText(300),
        summer: nullableText(300),
        autumn: nullableText(300),
        winter: nullableText(300),
      }),
      weekdayCrowds: nullableEnum(CROWDS),
      weekendCrowds: nullableEnum(CROWDS),
      parking: nullableText(200),
      washrooms: nullableText(200),
      changing: nullableText(200),
      permits: z.strictObject({
        portrait: nullableEnum(PERMIT),
        weddingEngagement: nullableEnum(PERMIT),
        commercial: nullableEnum(PERMIT),
        video: nullableEnum(PERMIT),
      }),
      permitSourceUrl: nullableUrl(),
      permitVerifiedAt: pastOrTodayDate(today, 'The permit verified date cannot be in the future').optional(),
      bestUses: z
        .array(z.enum(BEST_USES, { error: 'Choose a listed use' }))
        .superRefine(uniqueBy((use) => use, null, 'This use is already selected')),
      disclosure: nullableEnum(['paid_in_full', 'discounted', 'comped']),
      disclosureProvider: nullableText(120),
      videoLink: videoIdField(),
      episodeTitle: nullableText(150),
      sampleShots: z.array(sampleShotOrderItem).max(30, { error: 'Use 30 sample shots or fewer' }),
    })
    .superRefine(requireBothCoordinates)
    .superRefine(requireDisclosureProvider)
    .transform((input) => ({
      ...input,
      disclosureProvider: input.disclosure === 'paid_in_full' ? null : input.disclosureProvider,
    }));
