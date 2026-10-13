import { ImageDto } from '../studio/image-dto';
import { LoadIn } from '../studio/load-in';
import { NaturalLightDto } from '../studio/natural-light-dto';
import { ComparedFeeDto } from './compared-fee-dto';
import { RubricScoreDto } from './rubric-score-dto';

/** One column of a comparison. Optional values are null when the review has none. */
export interface ComparedStudioDto {
  slug: string;
  name: string;
  allInCost2h: number;
  hourlyRate: number;
  minimumBookingHours: number;
  mandatoryFees: ComparedFeeDto[];
  usableWidthM: number | null;
  usableDepthM: number | null;
  ceilingHeightM: number | null;
  naturalLight: NaturalLightDto | null;
  hasCycWall: boolean | null;
  cycWallCondition: string | null;
  includedGear: string[];
  parking: string | null;
  loadIn: LoadIn | null;
  loadInNote: string | null;
  rubricScores: RubricScoreDto[];
  overallScore: number;
  /** ISO date, YYYY-MM-DD. */
  priceLastVerified: string;
  priceStale: boolean;
  isLowestAllInCost: boolean;
  testShots: ImageDto[];
}
