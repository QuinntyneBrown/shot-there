import type { Prisma, PrismaClient } from '@/generated/prisma/client';
import { toIsoDate, toNumber } from '@/lib/data/prisma-values';
import type { ImageRecord } from '@/lib/images/image-record';
import type { StudioRecord } from '@/lib/studios/studio-record';
import type { StudioRepository } from '@/lib/studios/studio-repository';

const studioInclude = {
  fees: { orderBy: { position: 'asc' } },
  gear: { orderBy: { position: 'asc' } },
  images: { orderBy: { sortOrder: 'asc' }, include: { variants: true } },
} satisfies Prisma.StudioInclude;

type StudioRow = Prisma.StudioGetPayload<{ include: typeof studioInclude }>;
type ImageRow = StudioRow['images'][number];

export class PrismaStudioRepository implements StudioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPublishedBySlug(slug: string): Promise<StudioRecord | null> {
    const row = await this.prisma.studio.findFirst({ where: { slug, status: 'published' }, include: studioInclude });
    return row ? toStudioRecord(row) : null;
  }
}

export function toImageRecord(row: ImageRow): ImageRecord {
  return {
    id: row.id,
    role: row.role,
    sortOrder: row.sortOrder,
    altText: row.altText,
    caption: row.caption,
    focalLengthMm: row.focalLengthMm,
    angleNote: row.angleNote,
    width: row.width,
    height: row.height,
    storageKey: row.storageKey,
    contentType: row.contentType,
    originalName: row.originalName,
    variants: row.variants.map(({ width, format, storageKey, url }) => ({ width, format, storageKey, url })),
  };
}

function toStudioRecord(row: StudioRow): StudioRecord {
  return {
    ...row,
    hourlyRate: toNumber(row.hourlyRate),
    minBookingHours: toNumber(row.minBookingHours),
    priceVerifiedAt: toIsoDate(row.priceVerifiedAt),
    usableWidthM: toNumber(row.usableWidthM),
    usableDepthM: toNumber(row.usableDepthM),
    ceilingHeightM: toNumber(row.ceilingHeightM),
    reviewedAt: row.reviewedAt ? toIsoDate(row.reviewedAt) : null,
    fees: row.fees.map((fee) => ({ name: fee.name, amount: fee.amount.toNumber(), mandatory: fee.mandatory })),
    gear: row.gear.map((item) => ({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      included: item.included,
      extraCost: toNumber(item.extraCost),
    })),
    images: row.images.map(toImageRecord),
  };
}
