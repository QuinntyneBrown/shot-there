import type { ExtraGearDto } from '@/lib/studios/extra-gear-dto';
import type { IncludedGearDto } from '@/lib/studios/included-gear-dto';

export interface StudioGearDto {
  included: IncludedGearDto[];
  /** Empty when nothing costs extra (L2-007). */
  extras: ExtraGearDto[];
}
