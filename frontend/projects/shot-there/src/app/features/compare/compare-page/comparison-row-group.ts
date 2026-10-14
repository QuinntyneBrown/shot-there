import { ComparisonRow } from './comparison-row';

/** Rows under one heading: Cost, Space and light, and so on. */
export interface ComparisonRowGroup {
  label: string;
  rows: ComparisonRow[];
}
