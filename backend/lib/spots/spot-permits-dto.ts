import type { PermitsByShootTypeDto } from '@/lib/spots/permits-by-shoot-type-dto';

export interface SpotPermitsDto {
  byShootType: PermitsByShootTypeDto;
  sourceUrl: string;
  verifiedAt: string;
  permitStale: boolean;
}
