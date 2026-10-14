import type { LightSlotDto } from '@/lib/spots/light-slot-dto';

export interface SpotLightByTimeDto {
  morning: LightSlotDto;
  midday: LightSlotDto;
  afternoon: LightSlotDto;
  goldenHour: LightSlotDto;
  blueHour: LightSlotDto;
}
