import { StudioSortOption } from './studio-sort-option';

export const STUDIO_SORT_OPTIONS: readonly StudioSortOption[] = [
  { value: 'recent', label: $localize`Most recent review`, announcement: $localize`Sorted by most recent review` },
  { value: 'cost', label: $localize`All-in cost, low to high`, announcement: $localize`Sorted by all-in cost, low to high` },
  { value: 'score', label: $localize`Overall score, high to low`, announcement: $localize`Sorted by overall score, high to low` }
];
