import type { LightSlotInput } from '@/lib/spots/light-slot-input';

export interface SpotLightByTimeInput {
  morning: LightSlotInput;
  midday: LightSlotInput;
  afternoon: LightSlotInput;
  goldenHour: LightSlotInput;
  blueHour: LightSlotInput;
}
