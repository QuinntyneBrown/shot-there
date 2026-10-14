import type { LightRating } from '@/lib/studios/light-rating';

export interface NaturalLightDto {
  morning: LightRating;
  midday: LightRating;
  afternoon: LightRating;
  evening: LightRating;
}
