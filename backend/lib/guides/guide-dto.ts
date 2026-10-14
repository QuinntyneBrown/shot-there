import type { GuideEntryDto } from '@/lib/guides/guide-entry-dto';

export interface GuideDto {
  slug: string;
  title: string;
  summary: string | null;
  introduction: string | null;
  /** In configured order; entries whose location is a draft are left out. */
  entries: GuideEntryDto[];
}
