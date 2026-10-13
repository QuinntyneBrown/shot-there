import type { StudioRecord } from '@/lib/studios/studio-record';

export interface StudioRepository {
  findPublishedBySlug(slug: string): Promise<StudioRecord | null>;
  listPublished(): Promise<StudioRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<StudioRecord[]>;
  /** One studio of any status. */
  findById(id: string): Promise<StudioRecord | null>;
  isSlugTaken(slug: string): Promise<boolean>;
  /**
   * Creates or replaces the studio's fields, fees and gear in one transaction, with the order and alt text of its
   * stored images. Images are never added or removed here.
   */
  save(studio: StudioRecord): Promise<void>;
  /** Deletes the studio with its fees, gear, images and every guide entry that references it, in one transaction. */
  delete(id: string): Promise<void>;
}
