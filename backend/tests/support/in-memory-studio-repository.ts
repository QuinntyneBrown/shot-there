import type { StudioRecord } from '@/lib/studios/studio-record';
import type { StudioRepository } from '@/lib/studios/studio-repository';

export class InMemoryStudioRepository implements StudioRepository {
  constructor(readonly rows: StudioRecord[] = []) {}

  async findPublishedBySlug(slug: string): Promise<StudioRecord | null> {
    return structuredClone(this.rows.find((row) => row.slug === slug && row.status === 'published') ?? null);
  }

  async listPublished(): Promise<StudioRecord[]> {
    return structuredClone(this.rows.filter((row) => row.status === 'published'));
  }

  async listAll(): Promise<StudioRecord[]> {
    return structuredClone(this.rows);
  }

  async findById(id: string): Promise<StudioRecord | null> {
    return structuredClone(this.rows.find((row) => row.id === id) ?? null);
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    return this.rows.some((row) => row.slug === slug);
  }

  async save(studio: StudioRecord): Promise<void> {
    const index = this.rows.findIndex((row) => row.id === studio.id);
    if (index === -1) {
      this.rows.push(structuredClone({ ...studio, images: [] }));
    } else {
      this.rows[index] = structuredClone({ ...studio, images: this.rows[index].images });
    }
  }
}
