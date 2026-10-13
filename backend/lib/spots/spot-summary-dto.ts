import type { ThumbnailDto } from '@/lib/images/thumbnail-dto';
import type { BestUse } from '@/lib/spots/best-use';
import type { PermitSummary } from '@/lib/spots/permit-summary';
import type { SpotType } from '@/lib/spots/spot-type';

/** One spot card in the public list. */
export interface SpotSummaryDto {
  slug: string;
  name: string;
  neighbourhood: string | null;
  type: SpotType | null;
  bestUses: BestUse[];
  permitSummary: PermitSummary;
  permitStale: boolean;
  thumbnail: ThumbnailDto | null;
}
