import type { PermitRequirementRecord } from '@/lib/spots/permit-requirement-record';

export interface SpotPermitsDto {
  rows: PermitRequirementRecord[];
  sourceUrl: string | null;
  verifiedOn: string;
  permitStale: boolean;
}
