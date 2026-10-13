import type { GearItemRecord } from '@/lib/studios/gear-item-record';
import type { IncludedGearDto } from '@/lib/studios/included-gear-dto';

export function toIncludedGearDto({ name, category, quantity }: GearItemRecord): IncludedGearDto {
  return { name, category, quantity };
}
