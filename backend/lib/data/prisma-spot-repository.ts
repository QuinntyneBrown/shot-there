import type { Prisma, PrismaClient } from '@/generated/prisma/client';
import { toImageRecord } from '@/lib/data/prisma-studio-repository';
import { fromIsoDate, toIsoDate } from '@/lib/data/prisma-values';
import type { SpotLightBySeasonRecord } from '@/lib/spots/spot-light-by-season-record';
import type { SpotLightByTimeRecord } from '@/lib/spots/spot-light-by-time-record';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotRepository } from '@/lib/spots/spot-repository';

const spotInclude = {
  permits: true,
  images: { orderBy: { sortOrder: 'asc' }, include: { variants: true } },
} satisfies Prisma.SpotInclude;

type SpotRow = Prisma.SpotGetPayload<{ include: typeof spotInclude }>;

export class PrismaSpotRepository implements SpotRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPublishedBySlug(slug: string): Promise<SpotRecord | null> {
    const row = await this.prisma.spot.findFirst({ where: { slug, status: 'published' }, include: spotInclude });
    return row ? toSpotRecord(row) : null;
  }

  async listPublished(): Promise<SpotRecord[]> {
    const rows = await this.prisma.spot.findMany({ where: { status: 'published' }, include: spotInclude });
    return rows.map(toSpotRecord);
  }

  async listAll(): Promise<SpotRecord[]> {
    const rows = await this.prisma.spot.findMany({ include: spotInclude });
    return rows.map(toSpotRecord);
  }

  async findById(id: string): Promise<SpotRecord | null> {
    const row = await this.prisma.spot.findUnique({ where: { id }, include: spotInclude });
    return row ? toSpotRecord(row) : null;
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    return (await this.prisma.spot.count({ where: { slug } })) > 0;
  }

  async save(spot: SpotRecord): Promise<void> {
    const { id, permits, images, lightByTime, lightBySeason, permitVerifiedAt, ...fields } = spot;
    const data = {
      ...fields,
      lightByTime: lightByTime as unknown as Prisma.InputJsonValue,
      lightBySeason: lightBySeason as unknown as Prisma.InputJsonValue,
      permitVerifiedAt: fromIsoDate(permitVerifiedAt),
    };
    await this.prisma.$transaction([
      this.prisma.spot.upsert({ where: { id }, create: { id, ...data }, update: data }),
      this.prisma.permitStatus.deleteMany({ where: { spotId: id } }),
      this.prisma.permitStatus.createMany({ data: permits.map((permit) => ({ spotId: id, ...permit })) }),
      ...images.map(({ id: imageId, sortOrder, altText, caption, focalLengthMm, angleNote }) =>
        this.prisma.image.updateMany({
          where: { id: imageId, spotId: id },
          data: { sortOrder, altText, caption, focalLengthMm, angleNote },
        }),
      ),
    ]);
  }

  /** Permits, images and image variants go with the spot through cascading relations. */
  async delete(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.guideEntry.deleteMany({ where: { spotId: id } }),
      this.prisma.spot.delete({ where: { id } }),
    ]);
  }
}

function toSpotRecord(row: SpotRow): SpotRecord {
  return {
    ...row,
    lightByTime: row.lightByTime as unknown as SpotLightByTimeRecord[],
    lightBySeason: row.lightBySeason as unknown as SpotLightBySeasonRecord[],
    permitVerifiedAt: toIsoDate(row.permitVerifiedAt),
    permits: row.permits.map(({ shootType, required }) => ({ shootType, required })),
    images: row.images.map(toImageRecord),
  };
}
