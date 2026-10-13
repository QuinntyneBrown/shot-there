/** `srSuffix` is visually hidden text after `detail` (" out of 5"). */
export interface Fact {
  term: string;
  detail: string;
  numeric?: boolean;
  badge?: string;
  srSuffix?: string;
}
