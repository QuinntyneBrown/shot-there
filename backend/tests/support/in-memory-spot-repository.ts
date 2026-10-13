import { withOrderAndAltText } from '@/tests/support/with-order-and-alt-text';
import type { InMemoryGuideRepository } from '@/tests/support/in-memory-guide-repository';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotRepository } from '@/lib/spots/spot-repository';

export class InMemorySpotRepository implements SpotRepository {
  constructor(
    readonly rows: SpotRecord[] = [],
    private readonly guides?: InMemoryGuideRepository,
  ) {}

  async findPublishedBySlug(slug: string): Promise<SpotRecord | null> {
    return structuredClone(this.rows.find((row) => row.slug === slug && row.status === 'published') ?? null);
  }

  async listPublished(): Promise<SpotRecord[]> {
    return structuredClone(this.rows.filter((row) => row.status === 'published'));
  }

  async listAll(): Promise<SpotRecord[]> {
    return structuredClone(this.rows);
  }

  async findById(id: string): Promise<SpotRecord | null> {
    return structuredClone(this.rows.find((row) => row.id === id) ?? null);
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    return this.rows.some((row) => row.slug === slug);
  }

  async save(spot: SpotRecord): Promise<void> {
    const index = this.rows.findIndex((row) => row.id === spot.id);
    if (index === -1) {
      this.rows.push(structuredClone({ ...spot, images: [] }));
    } else {
      this.rows[index] = structuredClone({ ...spot, images: withOrderAndAltText(this.rows[index].images, spot.images) });
    }
  }

  async delete(id: string): Promise<void> {
    this.rows.splice(0, this.rows.length, ...this.rows.filter((row) => row.id !== id));
    this.guides?.removeEntriesFor('spot', id);
  }
}
