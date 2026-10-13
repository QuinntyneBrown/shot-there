import type { Prisma, PrismaClient } from '@/generated/prisma/client';
import type { GuideRecord } from '@/lib/guides/guide-record';
import type { GuideRepository } from '@/lib/guides/guide-repository';

const guideInclude = { entries: { orderBy: { position: 'asc' } } } satisfies Prisma.GuideInclude;

type GuideRow = Prisma.GuideGetPayload<{ include: typeof guideInclude }>;

export class PrismaGuideRepository implements GuideRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPublishedBySlug(slug: string): Promise<GuideRecord | null> {
    const row = await this.prisma.guide.findFirst({ where: { slug, status: 'published' }, include: guideInclude });
    return row ? toGuideRecord(row) : null;
  }

  async listPublished(): Promise<GuideRecord[]> {
    const rows = await this.prisma.guide.findMany({ where: { status: 'published' }, include: guideInclude });
    return rows.map(toGuideRecord);
  }
}

function toGuideRecord(row: GuideRow): GuideRecord {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    introduction: row.introduction,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    entries: row.entries.map((entry) => ({
      kind: entry.studioId ? 'studio' : 'spot',
      locationId: entry.studioId ?? entry.spotId ?? '',
      note: entry.note,
      position: entry.position,
    })),
  };
}
