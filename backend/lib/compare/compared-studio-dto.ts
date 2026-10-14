import type { CaptionedImageDto } from '@/lib/images/captioned-image-dto';
import type { IncludedGearDto } from '@/lib/studios/included-gear-dto';
import type { LoadIn } from '@/lib/studios/load-in';
import type { ParkingOption } from '@/lib/studios/parking-option';
import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';
import type { StudioPricingDto } from '@/lib/studios/studio-pricing-dto';
import type { StudioSpecificationsDto } from '@/lib/studios/studio-specifications-dto';

/** One studio column of a comparison (ICD §13.3). */
export interface ComparedStudioDto {
  slug: string;
  name: string;
  /** The mandatory-fees row reads the fees where `mandatory` is true. */
  pricing: StudioPricingDto;
  specifications: StudioSpecificationsDto;
  includedGear: IncludedGearDto[];
  /** Null is shown as "—" (L2-031). */
  parking: ParkingOption | null;
  loadIn: LoadIn | null;
  scores: RubricScoresDto;
  overallScore: number;
  testShots: CaptionedImageDto[];
  isLowestAllInCost: boolean;
}
