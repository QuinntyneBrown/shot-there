import type { GuideEntryDto } from '@/lib/guides/guide-entry-dto';

export interface GuideDto {
  slug: string;
  title: string;
  introduction: string;
  entries: GuideEntryDto[];
}
