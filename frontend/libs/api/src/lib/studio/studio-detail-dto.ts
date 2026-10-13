import { StudioBasicsDto } from './studio-basics-dto';
import { StudioPricingDto } from './studio-pricing-dto';

/** One published studio review, as GET /api/studios/{slug} returns it. */
export interface StudioDetailDto {
  slug: string;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
}
