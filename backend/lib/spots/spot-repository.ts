import type { SpotRecord } from '@/lib/spots/spot-record';

export interface SpotRepository {
  findPublishedBySlug(slug: string): Promise<SpotRecord | null>;
  listPublished(): Promise<SpotRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<SpotRecord[]>;
  /** One spot of any status. */
  findById(id: string): Promise<SpotRecord | null>;
  isSlugTaken(slug: string): Promise<boolean>;
  /**
   * Creates or replaces the spot fields and permit rows in one transaction, with the order and alt text of its stored
   * images. Images are never added or removed here.
   */
  save(spot: SpotRecord): Promise<void>;
  /** Deletes the spot with its permits, images and every guide entry that references it, in one transaction. */
  delete(id: string): Promise<void>;
}
