import { z } from 'zod';
import {
  boundedNumber,
  cad,
  nullableBoolean,
  nullableEnum,
  nullableNumber,
  nullableText,
  nullableUrl,
  pastOrTodayDate,
  requireBothCoordinates,
  requiredText,
  slugField,
} from '@/lib/http/input-fields';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';
import { videoIdField } from '@/lib/videos/schemas';
import { requireDisclosureProvider } from '@/lib/publishing/schemas';

const optionalQueryAmount = z.coerce.number().nonnegative().finite().optional().catch(undefined);
const knownValues = <T extends string>(values: readonly T[]) =>
  z.array(z.string()).transform((list) => list.filter((value): value is T => (values as readonly string[]).includes(value)));
/** A boolean query flag is on only when its value is exactly `true` (ICD C-20). */
const flag = z.string().optional().transform((value) => value === 'true');
const positiveQueryAmount = z.coerce.number().positive().finite().optional().catch(undefined);

/** Lenient: unknown values are dropped and an inverted cost range is unset; parsing never fails. */
export const studioListQuerySchema = z
  .object({
    costMin: optionalQueryAmount,
    costMax: optionalQueryAmount,
    hood: z.array(z.string()).transform((list) => list.map((hood) => hood.trim()).filter(Boolean)),
    light: flag,
    cyc: flag,
    space: positiveQueryAmount,
    gear: knownValues(['lights', 'modifiers', 'stands', 'backdrops'] as const),
    parking: z.enum(['on_site', 'street', 'none']).optional().catch(undefined),
    sort: z.enum(['cost', 'score', 'recent']).catch('recent'),
  })
  .transform(({ costMin, costMax, hood, light, cyc, space, gear, parking, sort }): StudioListQuery => {
    const inverted = costMin !== undefined && costMax !== undefined && costMin > costMax;
    return {
      costMin: inverted ? undefined : costMin,
      costMax: inverted ? undefined : costMax,
      neighbourhoods: hood,
      naturalLight: light,
      cycWall: cyc,
      minSpaceSqm: space,
      gear,
      parking,
      sort,
    };
  });

export function parseStudioListQuery(searchParams: URLSearchParams): StudioListQuery {
  const single = (name: string) => searchParams.get(name) ?? undefined;
  return studioListQuerySchema.parse({
    costMin: single('costMin'),
    costMax: single('costMax'),
    hood: searchParams.getAll('hood'),
    light: single('light'),
    cyc: single('cyc'),
    space: single('space'),
    gear: searchParams.getAll('gear'),
    parking: single('parking'),
    sort: single('sort'),
  });
}

const LIGHT = ['none', 'low', 'medium', 'strong'] as const;
const metres = (max: number) => nullableNumber({ min: 0, above: true, max, decimals: 2 });
const score = () => nullableNumber({ min: 1, max: 5, integer: true });
const alt = () => requiredText('Describe this image', 300);

const studioFeeInputSchema = z.strictObject({
  name: requiredText('Enter a fee name', 80),
  amount: cad(),
  mandatory: z.boolean({ error: 'Choose whether the fee is mandatory' }),
});

const gearItemInputSchema = z
  .strictObject({
    name: requiredText('Enter a gear name', 80),
    category: z.enum(['lights', 'modifiers', 'stands', 'backdrops', 'other'], { error: 'Choose a gear category' }),
    quantity: boundedNumber({ min: 1, max: 99, integer: true }),
    included: z.boolean({ error: 'Choose whether the item is included' }),
    extraCost: cad().nullable(),
  })
  .superRefine((item, context) => {
    if (!item.included && item.extraCost === null) {
      context.addIssue({ code: 'custom', path: ['extraCost'], message: 'Enter what it costs extra', params: { code: 'required' } });
    }
  })
  // An included item costs nothing extra.
  .transform((item) => (item.included ? { ...item, extraCost: null } : item));

const lightRatings = z.strictObject({
  morning: nullableEnum(LIGHT),
  midday: nullableEnum(LIGHT),
  afternoon: nullableEnum(LIGHT),
  evening: nullableEnum(LIGHT),
});

const rubricScores = z.strictObject({
  value: score(),
  light: score(),
  space: score(),
  gear: score(),
  logistics: score(),
  condition: score(),
});

const testShotOrderItem = z.strictObject({
  imageId: z.string({ error: 'Choose an image' }).min(1, { error: 'Choose an image' }).max(64),
  alt: alt(),
  caption: requiredText('Describe the setup', 200),
});

const imageOrderItem = z.strictObject({
  imageId: z.string({ error: 'Choose an image' }).min(1, { error: 'Choose an image' }).max(64),
  alt: alt(),
});

/** The owner's studio save body (ICD §13.10, §15.1). Strict: every property present, unknown ones refused. */
export const studioInputSchema = (today: string) =>
  z
    .strictObject({
      name: requiredText('Enter a name', 120),
      slug: slugField().optional(),
      neighbourhood: nullableText(80),
      addressOrCrossStreets: nullableText(200),
      bookingUrl: nullableUrl(),
      latitude: nullableNumber({ min: -90, max: 90 }),
      longitude: nullableNumber({ min: -180, max: 180 }),
      hourlyRate: cad().nullable(),
      minBookingHours: nullableNumber({ min: 0, above: true, max: 24, decimals: 2 }),
      fees: z.array(studioFeeInputSchema).max(20, { error: 'Use 20 fees or fewer' }),
      priceVerifiedAt: pastOrTodayDate(today, 'The price verified date cannot be in the future').optional(),
      usableWidth: metres(100),
      usableDepth: metres(100),
      ceilingHeight: metres(30),
      windowDirection: nullableText(80),
      naturalLight: lightRatings,
      outletCount: nullableNumber({ min: 0, max: 100, integer: true }),
      outletType: nullableText(80),
      has20aCircuits: nullableBoolean(),
      hasCycWall: nullableBoolean(),
      cycWallCondition: nullableText(80),
      backdrops: z.array(requiredText('Name the backdrop', 80)).max(20, { error: 'Use 20 backdrops or fewer' }),
      gear: z.array(gearItemInputSchema).max(50, { error: 'Use 50 gear items or fewer' }),
      loadIn: nullableEnum(['stairs', 'elevator', 'freight_elevator']),
      loadInNote: nullableText(200),
      parking: nullableEnum(['on_site', 'street', 'none']),
      transit: nullableText(300),
      washroom: nullableText(200),
      changingArea: nullableText(200),
      clientSeating: nullableText(200),
      noise: nullableText(200),
      scores: rubricScores,
      whoItsFor: nullableText(2000),
      whoShouldSkip: nullableText(2000),
      disclosure: nullableEnum(['paid_in_full', 'discounted', 'comped']),
      disclosureProvider: nullableText(120),
      videoLink: videoIdField(),
      episodeTitle: nullableText(150),
      testShots: z.array(testShotOrderItem).max(12, { error: 'Use 12 test shots or fewer' }),
      gallery: z.array(imageOrderItem).max(60, { error: 'Use 60 gallery images or fewer' }),
    })
    .superRefine(requireBothCoordinates)
    .superRefine(requireDisclosureProvider)
    // Stored only where they apply (ICD §15.1).
    .transform((input) => ({
      ...input,
      cycWallCondition: input.hasCycWall === true ? input.cycWallCondition : null,
      disclosureProvider: input.disclosure === 'paid_in_full' ? null : input.disclosureProvider,
    }));
