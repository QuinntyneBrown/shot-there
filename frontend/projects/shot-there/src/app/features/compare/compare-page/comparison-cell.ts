import { ResponsiveImage } from '@shot-there/components';

/** One studio's value in a comparison row. */
export interface ComparisonCell {
  text: string;
  /** Several short lines, such as natural light by time of day. */
  lines?: string[];
  /** A score shown as "n / 5". */
  isScore?: boolean;
  isStrong?: boolean;
  isLowest?: boolean;
  isStale?: boolean;
  image?: ResponsiveImage;
}
