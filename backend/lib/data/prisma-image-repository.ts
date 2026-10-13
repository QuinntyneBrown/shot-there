import type { PrismaClient } from '@/generated/prisma/client';
import type { ImageOwner } from '@/lib/images/image-owner';
import type { ImageRecord } from '@/lib/images/image-record';
import type { ImageRepository } from '@/lib/images/image-repository';

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
}
