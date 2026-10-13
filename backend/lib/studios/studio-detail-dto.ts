import type { StudioBasicsDto } from '@/lib/studios/studio-basics-dto';
import type { StudioPricingDto } from '@/lib/studios/studio-pricing-dto';

/** The public studio page contract returned by `GET /api/studios/{slug}`. */
export interface StudioDetailDto {
  slug: string;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
}
