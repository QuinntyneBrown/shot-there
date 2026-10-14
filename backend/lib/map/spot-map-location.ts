import type { PermitsByShootTypeDto } from '@/lib/spots/permits-by-shoot-type-dto';

export interface SpotMapLocation {
  kind: 'spot';
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  permits: PermitsByShootTypeDto;
  permitStale: boolean;
}
