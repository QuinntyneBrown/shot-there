import type { GuideRecord } from '@/lib/guides/guide-record';
import type { GuideRepository } from '@/lib/guides/guide-repository';

export class InMemoryGuideRepository implements GuideRepository {
  constructor(readonly rows: GuideRecord[] = []) {}

  async findPublishedBySlug(slug: string): Promise<GuideRecord | null> {
    return structuredClone(this.rows.find((row) => row.slug === slug && row.status === 'published') ?? null);
  }

  async listPublished(): Promise<GuideRecord[]> {
    return structuredClone(this.rows.filter((row) => row.status === 'published'));
  }
}
