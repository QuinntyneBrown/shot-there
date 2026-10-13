import type { GuideRecord } from '@/lib/guides/guide-record';

export interface GuideRepository {
  findPublishedBySlug(slug: string): Promise<GuideRecord | null>;
  listPublished(): Promise<GuideRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<GuideRecord[]>;
  /** One guide of any status. */
  findById(id: string): Promise<GuideRecord | null>;
  isSlugTaken(slug: string): Promise<boolean>;
  /** Creates or replaces the guide and its entries in one transaction. */
  save(guide: GuideRecord): Promise<void>;
  /** Deletes the guide and its entries in one transaction. */
  delete(id: string): Promise<void>;
}
