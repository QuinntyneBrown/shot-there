import type { SpotMapLocation } from '@/lib/map/spot-map-location';
import type { StudioMapLocation } from '@/lib/map/studio-map-location';

/** One map marker, discriminated on `kind`. */
export type MapLocation = StudioMapLocation | SpotMapLocation;
