import type { PrismaClient } from '@/generated/prisma/client';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { OwnerRepository } from '@/lib/auth/owner-repository';

export class PrismaOwnerRepository implements OwnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<OwnerRecord | null> {
    return this.prisma.owner.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true, email: true, passwordHash: true },
    });
  }
}
