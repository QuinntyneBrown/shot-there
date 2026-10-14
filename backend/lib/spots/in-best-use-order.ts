import type { BestUse } from '@/lib/spots/best-use';

const BEST_USE_ORDER: BestUse[] = ['engagement', 'family', 'portrait', 'brand', 'video'];

/** The best uses in the fixed order engagement, family, portrait, brand, video. */
export function inBestUseOrder(bestUses: BestUse[]): BestUse[] {
  return BEST_USE_ORDER.filter((use) => bestUses.includes(use));
}
