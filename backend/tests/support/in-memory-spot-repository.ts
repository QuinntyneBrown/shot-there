import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotRepository } from '@/lib/spots/spot-repository';

export class InMemorySpotRepository implements SpotRepository {
  constructor(readonly rows: SpotRecord[] = []) {}

  async findPublishedBySlug(slug: string): Promise<SpotRecord | null> {
    return structuredClone(this.rows.find((row) => row.slug === slug && row.status === 'published') ?? null);
  }

  async listPublished(): Promise<SpotRecord[]> {
    return structuredClone(this.rows.filter((row) => row.status === 'published'));
  }

  async listAll(): Promise<SpotRecord[]> {
    return structuredClone(this.rows);
  }
}
