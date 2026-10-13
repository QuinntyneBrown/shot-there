import type { PrismaClient } from '@/generated/prisma/client';
import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';
import type { SlugRedirectRepository } from '@/lib/slugs/slug-redirect-repository';

export class PrismaSlugRedirectRepository implements SlugRedirectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async find(type: ContentType, fromSlug: string): Promise<SlugRedirectRecord | null> {
    const row = await this.prisma.slugRedirect.findUnique({ where: { type_fromSlug: { type, fromSlug } } });
    return row ? { type: row.type, fromSlug: row.fromSlug, toSlug: row.toSlug } : null;
  }

  async recordChange(type: ContentType, fromSlug: string, toSlug: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.slugRedirect.deleteMany({ where: { type, fromSlug: { in: [fromSlug, toSlug] } } }),
      this.prisma.slugRedirect.updateMany({ where: { type, toSlug: fromSlug }, data: { toSlug } }),
      this.prisma.slugRedirect.create({ data: { type, fromSlug, toSlug } }),
    ]);
  }
}
