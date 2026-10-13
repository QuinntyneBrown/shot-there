import { StudioBasicsDto } from './studio-basics-dto';
import { StudioGearDto } from './studio-gear-dto';
import { StudioLogisticsDto } from './studio-logistics-dto';
import { StudioPricingDto } from './studio-pricing-dto';
import { StudioSpecificationsDto } from './studio-specifications-dto';

/** One published studio review, as GET /api/studios/{slug} returns it. */
export interface StudioDetailDto {
  slug: string;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
  specifications: StudioSpecificationsDto;
  gear: StudioGearDto;
  logistics: StudioLogisticsDto;
}
