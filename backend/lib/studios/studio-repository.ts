import type { StudioRecord } from '@/lib/studios/studio-record';

export interface StudioRepository {
  findPublishedBySlug(slug: string): Promise<StudioRecord | null>;
  listPublished(): Promise<StudioRecord[]>;
}
