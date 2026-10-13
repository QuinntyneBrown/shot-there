import { LightRating, StudioSpecificationsDto } from '@shot-there/api';

const FEET_PER_METRE = 3.28084;

const toFeet = (metres: number) => Math.round(metres * FEET_PER_METRE);
const metres = (value: number) => value.toFixed(1);

/** "6.1 m × 4.3 m (20 ft × 14 ft)", feet rounded to the nearest whole foot. */
export function formatDimensions(widthM: number, depthM: number): string {
  return $localize`${metres(widthM)}:width: m × ${metres(depthM)}:depth: m (${toFeet(widthM)}:widthFt: ft × ${toFeet(depthM)}:depthFt: ft)`;
}

/** "4.0 m (13 ft)". */
export function formatHeight(heightM: number): string {
  return $localize`${metres(heightM)}:height: m (${toFeet(heightM)}:heightFt: ft)`;
}

/** "Yes · scuffed", "Yes", or "No" with no condition. */
export function cycWallLabel(specifications: StudioSpecificationsDto): string {
  if (!specifications.hasCycWall) {
    return $localize`No`;
  }
  return specifications.cycWallCondition ? $localize`Yes · ${specifications.cycWallCondition}:condition:` : $localize`Yes`;
}

/** "8 outlets, standard 15 A · 20 A circuits: Yes". */
export function powerLabel(specifications: StudioSpecificationsDto): string {
  const circuits = specifications.has20ACircuits ? $localize`Yes` : $localize`No`;
  return $localize`${specifications.outletCount}:count: outlets, ${specifications.outletType}:type: · 20 A circuits: ${circuits}:circuits:`;
}

export const LIGHT_RATING_LABELS: Record<LightRating, string> = {
  none: $localize`None`,
  low: $localize`Low`,
  medium: $localize`Medium`,
  strong: $localize`Strong`
};

/** Filled pips out of three for each rating. */
export const LIGHT_RATING_PIPS: Record<LightRating, number> = { none: 0, low: 1, medium: 2, strong: 3 };
