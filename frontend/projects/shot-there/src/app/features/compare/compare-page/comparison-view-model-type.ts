import { ComparisonRowGroup } from './comparison-row-group';

/** Everything the comparison page shows. */
export interface ComparisonViewModel {
  /** Studio names, one per column. */
  columns: { slug: string; name: string }[];
  groups: ComparisonRowGroup[];
  notices: string[];
  /** False when fewer than two studios could be compared. */
  canShowTable: boolean;
  /** "A, B and C". */
  namesList: string;
}
