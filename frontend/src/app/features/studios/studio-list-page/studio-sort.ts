/** Studio list order: all-in cost ascending, overall score descending, or most recent review first. */
export type StudioSort = 'cost' | 'score' | 'recent';

export const STUDIO_SORTS: readonly StudioSort[] = ['recent', 'cost', 'score'];

export const DEFAULT_STUDIO_SORT: StudioSort = 'recent';
