import type { ComparedStudioDto } from '@/lib/compare/compared-studio-dto';

export interface ComparisonDto {
  studios: ComparedStudioDto[];
  /** Requested slugs that match no published studio. */
  notFoundSlugs: string[];
  /** True when more than four valid studios were requested and only the first four are compared. */
  truncated: boolean;
}
