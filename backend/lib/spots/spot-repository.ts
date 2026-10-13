import type { SpotRecord } from '@/lib/spots/spot-record';

export interface SpotRepository {
  findPublishedBySlug(slug: string): Promise<SpotRecord | null>;
  listPublished(): Promise<SpotRecord[]>;
}
