import type { LightRating } from '@/lib/studios/light-rating';

export interface LightSlotDto {
  rating: LightRating;
  note: string | null;
}
