import type { LightRating } from '@/lib/studios/light-rating';

export interface NaturalLightInput {
  morning: LightRating | null;
  midday: LightRating | null;
  afternoon: LightRating | null;
  evening: LightRating | null;
}
