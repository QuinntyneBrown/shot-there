import type { StudioRecord } from '@/lib/studios/studio-record';

export interface StudioRepository {
  findPublishedBySlug(slug: string): Promise<StudioRecord | null>;
  listPublished(): Promise<StudioRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<StudioRecord[]>;
  /** One studio of any status. */
  findById(id: string): Promise<StudioRecord | null>;
  isSlugTaken(slug: string): Promise<boolean>;
  /** Creates or replaces the studio's fields, fees and gear in one transaction. Images are left as stored. */
  save(studio: StudioRecord): Promise<void>;
}
