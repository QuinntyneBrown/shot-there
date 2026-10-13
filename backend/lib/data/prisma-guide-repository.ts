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

  async listAll(): Promise<GuideRecord[]> {
    const rows = await this.prisma.guide.findMany({ include: guideInclude });
    return rows.map(toGuideRecord);
  }

  async findById(id: string): Promise<GuideRecord | null> {
    const row = await this.prisma.guide.findUnique({ where: { id }, include: guideInclude });
    return row ? toGuideRecord(row) : null;
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    return (await this.prisma.guide.count({ where: { slug } })) > 0;
  }

  async save(guide: GuideRecord): Promise<void> {
    const { id, entries, ...fields } = guide;
    await this.prisma.$transaction([
      this.prisma.guide.upsert({ where: { id }, create: { id, ...fields }, update: fields }),
      this.prisma.guideEntry.deleteMany({ where: { guideId: id } }),
      this.prisma.guideEntry.createMany({
        data: entries.map(({ kind, locationId, note, position }) => ({
          guideId: id,
          studioId: kind === 'studio' ? locationId : null,
          spotId: kind === 'spot' ? locationId : null,
          note,
          position,
        })),
      }),
    ]);
  }

  /** Entries go with the guide through the cascading relation. */
  async delete(id: string): Promise<void> {
    await this.prisma.guide.delete({ where: { id } });
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
