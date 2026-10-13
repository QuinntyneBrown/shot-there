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

  async listAll(): Promise<GuideRecord[]> {
    return structuredClone(this.rows);
  }

  async findById(id: string): Promise<GuideRecord | null> {
    return structuredClone(this.rows.find((row) => row.id === id) ?? null);
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    return this.rows.some((row) => row.slug === slug);
  }

  async save(guide: GuideRecord): Promise<void> {
    const index = this.rows.findIndex((row) => row.id === guide.id);
    if (index === -1) this.rows.push(structuredClone(guide));
    else this.rows[index] = structuredClone(guide);
  }
}
