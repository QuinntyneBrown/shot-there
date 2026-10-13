import type { SpotRecord } from '@/lib/spots/spot-record';

export interface SpotRepository {
  findPublishedBySlug(slug: string): Promise<SpotRecord | null>;
  listPublished(): Promise<SpotRecord[]>;
  /** Every row, draft and published. */
  listAll(): Promise<SpotRecord[]>;
  /** One spot of any status. */
  findById(id: string): Promise<SpotRecord | null>;
  isSlugTaken(slug: string): Promise<boolean>;
  /** Creates or replaces the spot fields and permit rows in one transaction. Images are left as stored. */
  save(spot: SpotRecord): Promise<void>;
}
