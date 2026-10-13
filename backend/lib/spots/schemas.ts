import { z } from 'zod';
import {
  optionalEnum,
  optionalRange,
  optionalText,
  optionalWebAddress,
  pastOrTodayDate,
  requiredText,
  slugField,
  uniqueBy,
} from '@/lib/http/input-fields';
import type { BestUse } from '@/lib/spots/best-use';
import type { SpotListQuery } from '@/lib/spots/spot-list-query';
import type { SpotType } from '@/lib/spots/spot-type';
import { imageOrderItemSchema } from '@/lib/images/schemas';
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
const SHOOT_TYPES = ['portrait', 'weddingEngagement', 'commercial', 'video'] as const;
const CROWDS = ['low', 'medium', 'high'] as const;

const lightByTimeInputSchema = z.strictObject({
  timeOfDay: z.enum(['morning', 'midday', 'afternoon', 'goldenHour', 'blueHour']),
  rating: z.enum(['none', 'low', 'medium', 'strong']),
  note: optionalText(500),
});

const lightBySeasonInputSchema = z.strictObject({
  season: z.enum(['spring', 'summer', 'autumn', 'winter']),
  note: optionalText(500),
});

const permitInputSchema = z.strictObject({
  shootType: z.enum(SHOOT_TYPES),
  required: z.boolean({ error: 'Choose whether a permit is required' }),
});

/** The owner's spot save body. Strict: unknown fields and values outside the fixed sets are refused. */
export const spotInputSchema = (today: string) =>
  z.strictObject({
    name: requiredText('Enter a name'),
    slug: slugField().optional(),
    neighbourhood: optionalText(200),
    type: optionalEnum(SPOT_TYPES),
    latitude: optionalRange(-90, 90, 'Enter a latitude from -90 to 90'),
    longitude: optionalRange(-180, 180, 'Enter a longitude from -180 to 180'),
    directions: optionalText(),
    lightByTime: z
      .array(lightByTimeInputSchema)
      .default([])
      .superRefine(uniqueBy((item) => item.timeOfDay, 'timeOfDay', 'This time of day is already listed')),
    lightBySeason: z
      .array(lightBySeasonInputSchema)
      .default([])
      .superRefine(uniqueBy((item) => item.season, 'season', 'This season is already listed')),
    weekdayCrowds: optionalEnum(CROWDS),
    weekendCrowds: optionalEnum(CROWDS),
    parking: optionalText(500),
    washrooms: optionalText(500),
    changing: optionalText(500),
    permits: z
      .array(permitInputSchema)
      .default([])
      .superRefine(uniqueBy((item) => item.shootType, 'shootType', 'This shoot type is already listed')),
    permitSourceUrl: optionalWebAddress(),
    permitVerifiedAt: pastOrTodayDate(today, 'The permit verified date cannot be in the future').optional(),
    bestUses: z
      .array(z.enum(BEST_USES))
      .default([])
      .superRefine(uniqueBy((use) => use, null, 'This use is already selected')),
    disclosure: optionalEnum(['paid_in_full', 'discounted', 'comped']),
    disclosureProvider: optionalText(200),
    videoLink: videoIdField(),
    episodeTitle: optionalText(150),
    images: z.array(imageOrderItemSchema).max(200).optional(),
  })
  .superRefine(requireDisclosureProvider);
