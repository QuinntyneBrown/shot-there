import type { DisclosureDto } from '@/lib/publishing/disclosure-dto';
import type { GuideLinkDto } from '@/lib/guides/guide-link-dto';
import type { ImageDto } from '@/lib/images/image-dto';
import type { StudioBasicsDto } from '@/lib/studios/studio-basics-dto';
import type { StudioGearDto } from '@/lib/studios/studio-gear-dto';
import type { StudioLogisticsDto } from '@/lib/studios/studio-logistics-dto';
import type { StudioPricingDto } from '@/lib/studios/studio-pricing-dto';
import type { StudioSpecificationsDto } from '@/lib/studios/studio-specifications-dto';
import type { StudioVerdictDto } from '@/lib/studios/studio-verdict-dto';
import type { EpisodeDto } from '@/lib/videos/episode-dto';

/** The public studio page contract returned by `GET /api/studios/{slug}`. */
export interface StudioDetailDto {
  slug: string;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
  specifications: StudioSpecificationsDto;
  gear: StudioGearDto;
  logistics: StudioLogisticsDto;
  testShots: ImageDto[];
  gallery: ImageDto[];
  verdict: StudioVerdictDto;
  disclosure: DisclosureDto;
  /** Null when no video is stored. */
  episode: EpisodeDto | null;
  /** Published guides that include the studio. */
  featuredIn: GuideLinkDto[];
}
