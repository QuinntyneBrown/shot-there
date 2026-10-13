import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRepository } from '@/lib/images/image-repository';
import type { LocatedImage } from '@/lib/images/located-image';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';

/** Keeps images inside the in-memory studio and spot rows they belong to. */
export class InMemoryImageRepository implements ImageRepository {
  constructor(
    private readonly studios: InMemoryStudioRepository,
    private readonly spots: InMemorySpotRepository,
  ) {}

  async add(owner: ImageOwner, image: ImageRecord): Promise<void> {
    const rows = owner.kind === 'studio' ? this.studios.rows : this.spots.rows;
    rows.find((row) => row.id === owner.id)?.images.push(structuredClone(image));
  }

  async findById(id: string): Promise<LocatedImage | null> {
    for (const [kind, rows] of [
      ['studio', this.studios.rows],
      ['spot', this.spots.rows],
    ] as const) {
      for (const row of rows) {
        const image = row.images.find((candidate) => candidate.id === id);
        if (image) return structuredClone({ owner: { kind, id: row.id }, image });
      }
    }
    return null;
  }

  async remove(id: string): Promise<void> {
    for (const row of [...this.studios.rows, ...this.spots.rows]) {
      row.images = row.images.filter((image) => image.id !== id);
    }
  }
}
