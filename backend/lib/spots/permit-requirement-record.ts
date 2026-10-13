import type { ShootType } from '@/lib/spots/shoot-type';

export interface PermitRequirementRecord {
  shootType: ShootType;
  required: boolean;
}
