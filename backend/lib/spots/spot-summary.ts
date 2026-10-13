import type { ImageDto } from '@/lib/images/image-dto';
import type { BestUse } from '@/lib/spots/best-use';
import type { PermitsByShootTypeDto } from '@/lib/spots/permits-by-shoot-type-dto';
import type { SpotType } from '@/lib/spots/spot-type';

/** One spot card in the public list and in guides (ICD §13.4). */
export interface SpotSummary {
  slug: string;
  name: string;
  neighbourhood: string;
  type: SpotType | null;
  bestUses: BestUse[];
  permits: PermitsByShootTypeDto;
  permitStale: boolean;
  /** The first sample shot. */
  thumbnail: ImageDto;
}
