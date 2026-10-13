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
}
