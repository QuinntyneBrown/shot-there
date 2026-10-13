import { z } from 'zod';
import type { BestUse } from '@/lib/spots/best-use';
import type { SpotListQuery } from '@/lib/spots/spot-list-query';
import type { SpotType } from '@/lib/spots/spot-type';

const TYPE_VALUES: Record<string, SpotType> = {
  park: 'park',
  architecture: 'architecture',
  waterfront: 'waterfront',
  'indoor-public': 'indoorPublic',
};
const USE_VALUES: BestUse[] = ['engagement', 'family', 'portrait', 'brand', 'video'];

/** Lenient: unknown values are dropped; parsing never fails. */
export const spotListQuerySchema = z.object({
  types: z.array(z.string()).transform((values) => values.flatMap((value) => TYPE_VALUES[value] ?? [])),
  useCases: z
    .array(z.string())
    .transform((values) => values.filter((value): value is BestUse => (USE_VALUES as string[]).includes(value))),
  permit: z.enum(['none-needed', 'any']).catch('any'),
});

export function parseSpotListQuery(searchParams: URLSearchParams): SpotListQuery {
  return spotListQuerySchema.parse({
    types: searchParams.getAll('type'),
    useCases: searchParams.getAll('use'),
    permit: searchParams.get('permit') ?? undefined,
  });
}
