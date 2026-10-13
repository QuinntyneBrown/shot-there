import { z } from 'zod';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';

const PARKING_VALUES = { 'on-site': 'onSite', street: 'street', none: 'none' } as const;

const optionalAmount = z.coerce.number().nonnegative().finite().optional().catch(undefined);
const knownValues = <T extends string>(values: readonly T[]) =>
  z.array(z.string()).transform((list) => list.filter((value): value is T => (values as readonly string[]).includes(value)));
const yesFlag = z.string().optional().transform((value) => value === 'yes');

/** Lenient: unknown values are dropped and an inverted cost range is unset; parsing never fails. */
export const studioListQuerySchema = z
  .object({
    costMin: optionalAmount,
    costMax: optionalAmount,
    hood: z.array(z.string().trim().min(1)).catch([]),
    light: yesFlag,
    cyc: yesFlag,
    space: optionalAmount,
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
