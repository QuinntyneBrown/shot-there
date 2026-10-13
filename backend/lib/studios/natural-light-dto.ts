import type { LightRating } from '@/lib/studios/light-rating';

export interface NaturalLightDto {
  morning: LightRating | null;
  midday: LightRating | null;
  afternoon: LightRating | null;
  evening: LightRating | null;
}
