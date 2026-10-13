import { StudioBasicsDto } from './studio-basics-dto';
import { StudioDisclosureDto } from './studio-disclosure-dto';
import { StudioGearDto } from './studio-gear-dto';
import { StudioLogisticsDto } from './studio-logistics-dto';
import { StudioPricingDto } from './studio-pricing-dto';
import { StudioSpecificationsDto } from './studio-specifications-dto';
import { StudioVerdictDto } from './studio-verdict-dto';

/** One published studio review, as GET /api/studios/{slug} returns it. */
export interface StudioDetailDto {
  slug: string;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
  specifications: StudioSpecificationsDto;
  gear: StudioGearDto;
  logistics: StudioLogisticsDto;
  verdict: StudioVerdictDto;
  disclosure: StudioDisclosureDto;
}
