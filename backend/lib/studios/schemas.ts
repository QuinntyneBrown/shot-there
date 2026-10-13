import { z } from 'zod';
import {
  amount,
  optionalAmount,
  optionalBoolean,
  optionalEnum,
  optionalPositive,
  optionalRange,
  optionalText,
  optionalWebAddress,
  optionalWholeNumber,
  pastOrTodayDate,
  requiredText,
} from '@/lib/http/input-fields';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';

const PARKING_VALUES = { 'on-site': 'onSite', street: 'street', none: 'none' } as const;

const optionalQueryAmount = z.coerce.number().nonnegative().finite().optional().catch(undefined);
const knownValues = <T extends string>(values: readonly T[]) =>
  z.array(z.string()).transform((list) => list.filter((value): value is T => (values as readonly string[]).includes(value)));
const yesFlag = z.string().optional().transform((value) => value === 'yes');

/** Lenient: unknown values are dropped and an inverted cost range is unset; parsing never fails. */
export const studioListQuerySchema = z
  .object({
    costMin: optionalQueryAmount,
    costMax: optionalQueryAmount,
    hood: z.array(z.string().trim().min(1)).catch([]),
    light: yesFlag,
    cyc: yesFlag,
    space: optionalQueryAmount,
    gear: knownValues(['lights', 'modifiers', 'stands', 'backdrops'] as const),
    parking: z.enum(['on-site', 'street', 'none']).optional().catch(undefined),
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
      parking: parking && PARKING_VALUES[parking],
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

const SCORE_MESSAGE = 'Enter a whole number from 1 to 5';
const LIGHT = ['none', 'low', 'medium', 'strong'] as const;
const score = () => optionalWholeNumber(1, 5, SCORE_MESSAGE);
const light = () => optionalEnum(LIGHT);

const studioFeeInputSchema = z.strictObject({
  name: requiredText('Enter a fee name'),
  amount: amount(),
  mandatory: z.boolean({ error: 'Choose whether the fee is mandatory' }),
});

const gearItemInputSchema = z.strictObject({
  name: requiredText('Enter a gear name'),
  category: z.enum(['lights', 'modifiers', 'stands', 'other'], { error: 'Choose a gear category' }),
  quantity: z.number({ error: 'Enter a whole number of 1 or more' }).int({ error: 'Enter a whole number of 1 or more' }).min(1, { error: 'Enter a whole number of 1 or more' }),
  included: z.boolean({ error: 'Choose whether the item is included' }),
  extraCost: optionalAmount(),
});

/** The owner's studio save body. Strict: unknown fields are refused. Only the name is required for a draft. */
export const studioInputSchema = (today: string) =>
  z.strictObject({
    name: requiredText('Enter a name'),
    neighbourhood: optionalText(200),
    addressOrCrossStreets: optionalText(200),
    bookingUrl: optionalWebAddress(),
    latitude: optionalRange(-90, 90, 'Enter a latitude from -90 to 90'),
    longitude: optionalRange(-180, 180, 'Enter a longitude from -180 to 180'),
    hourlyRate: optionalAmount(),
    minBookingHours: optionalPositive('Enter a number of hours greater than 0'),
    priceVerifiedAt: pastOrTodayDate(today, 'The price verified date cannot be in the future').optional(),
    usableWidthM: optionalPositive('Enter a size in metres greater than 0'),
    usableDepthM: optionalPositive('Enter a size in metres greater than 0'),
    ceilingHeightM: optionalPositive('Enter a height in metres greater than 0'),
    windowDirection: optionalText(100),
    lightMorning: light(),
    lightMidday: light(),
    lightAfternoon: light(),
    lightEvening: light(),
    outletCount: optionalWholeNumber(0, 1000, 'Enter a whole number of 0 or more'),
    outletType: optionalText(200),
    has20ACircuits: optionalBoolean(),
    hasCycWall: optionalBoolean(),
    cycWallCondition: optionalText(200),
    backdrops: optionalText(500),
    loadIn: optionalEnum(['stairs', 'elevator', 'freightElevator']),
    loadInNote: optionalText(500),
    parking: optionalEnum(['onSite', 'street', 'none']),
    parkingNote: optionalText(500),
    transit: optionalText(500),
    washroom: optionalText(500),
    changingArea: optionalText(500),
    clientSeating: optionalText(500),
    noise: optionalText(500),
    whoItsFor: optionalText(),
    whoShouldSkip: optionalText(),
    scoreValue: score(),
    scoreLight: score(),
    scoreSpace: score(),
    scoreGear: score(),
    scoreLogistics: score(),
    scoreCondition: score(),
    disclosure: optionalEnum(['paid_in_full', 'discounted', 'comped']),
    disclosureProvider: optionalText(200),
    reviewedAt: pastOrTodayDate(today, 'The review date cannot be in the future').nullable().default(null),
    episodeTitle: optionalText(200),
    fees: z.array(studioFeeInputSchema).max(50).default([]),
    gear: z.array(gearItemInputSchema).max(200).default([]),
  });
