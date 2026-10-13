import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRepository } from '@/lib/images/image-repository';
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
}
