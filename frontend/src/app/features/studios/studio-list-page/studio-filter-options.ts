import { NeighbourhoodOption } from './neighbourhood-option';

/** Neighbourhoods with a published studio, as the mocks list them. */
export const NEIGHBOURHOOD_OPTIONS: readonly NeighbourhoodOption[] = [
  { slug: 'bloordale', label: $localize`Bloordale` },
  { slug: 'junction', label: $localize`Junction` },
  { slug: 'kensington-market', label: $localize`Kensington Market` },
  { slug: 'leslieville', label: $localize`Leslieville` },
  { slug: 'liberty-village', label: $localize`Liberty Village` },
  { slug: 'ossington', label: $localize`Ossington` },
  { slug: 'riverside', label: $localize`Riverside` }
];

/** Minimum usable space choices, in square metres. */
export const MIN_SPACE_OPTIONS: readonly number[] = [20, 30, 50];
