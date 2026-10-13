import type { PrismaClient } from '@/generated/prisma/client';
import { toImageRecord } from '@/lib/data/prisma-studio-repository';
import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRepository } from '@/lib/images/image-repository';
import type { LocatedImage } from '@/lib/images/located-image';

export class PrismaImageRepository implements ImageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(owner: ImageOwner, { variants, ...image }: ImageRecord): Promise<void> {
    await this.prisma.image.create({
      data: {
        ...image,
        studioId: owner.kind === 'studio' ? owner.id : null,
        spotId: owner.kind === 'spot' ? owner.id : null,
        variants: { create: variants },
      },
    });
  }

  async findById(id: string): Promise<LocatedImage | null> {
    const row = await this.prisma.image.findUnique({ where: { id }, include: { variants: true } });
    if (!row) return null;
    const owner: ImageOwner = row.studioId ? { kind: 'studio', id: row.studioId } : { kind: 'spot', id: row.spotId ?? '' };
    return { owner, image: toImageRecord(row) };
  }

  /** Variant rows go with the image through the cascading relation. */
  async remove(id: string): Promise<void> {
    await this.prisma.image.delete({ where: { id } });
  }
}
