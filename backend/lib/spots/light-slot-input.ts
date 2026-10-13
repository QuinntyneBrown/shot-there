import type { LightRating } from '@/lib/studios/light-rating';

export interface LightSlotInput {
  rating: LightRating | null;
  note: string | null;
}
