import type { ImageDto } from '@/lib/images/image-dto';
import type { CycWallDto } from '@/lib/studios/cyc-wall-dto';
import type { GearItemDto } from '@/lib/studios/gear-item-dto';
import type { LoadIn } from '@/lib/studios/load-in';
import type { NaturalLightDto } from '@/lib/studios/natural-light-dto';
import type { ParkingOption } from '@/lib/studios/parking-option';
import type { RubricScoresDto } from '@/lib/studios/rubric-scores-dto';
import type { StudioFeeDto } from '@/lib/studios/studio-fee-dto';

/** One studio column of a comparison. */
export interface ComparedStudioDto {
  slug: string;
  name: string;
  allInCost2h: number | null;
  isLowestAllInCost: boolean;
  hourlyRate: number | null;
  minBookingHours: number | null;
  mandatoryFees: StudioFeeDto[];
  usableWidthM: number | null;
  usableDepthM: number | null;
  ceilingHeightM: number | null;
  naturalLight: NaturalLightDto;
  cycWall: CycWallDto;
  includedGear: GearItemDto[];
  parking: ParkingOption | null;
  loadIn: LoadIn | null;
  scores: RubricScoresDto;
  overallScore: number | null;
  priceVerifiedAt: string;
  priceStale: boolean;
  testShots: ImageDto[];
}
