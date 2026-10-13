import type { PrismaClient } from '@/generated/prisma/client';
import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import type { OwnerSessionRepository } from '@/lib/auth/owner-session-repository';

export class PrismaOwnerSessionRepository implements OwnerSessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(session: OwnerSessionRecord): Promise<void> {
    await this.prisma.ownerSession.create({ data: session });
  }
}
