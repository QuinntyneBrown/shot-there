import { ComparedStudioDto } from './compared-studio-dto';

/** GET /api/compare answers 200 with whatever it could compare. */
export interface ComparisonDto {
  /** The valid studios, in URL order, at most 4. */
  studios: ComparedStudioDto[];
  notFoundSlugs: string[];
  /** True when the link held more than 4 valid studios. */
  truncated: boolean;
}
