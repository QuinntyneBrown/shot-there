import type { GuideRecord } from '@/lib/guides/guide-record';

export interface GuideRepository {
  findPublishedBySlug(slug: string): Promise<GuideRecord | null>;
  listPublished(): Promise<GuideRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<GuideRecord[]>;
}
