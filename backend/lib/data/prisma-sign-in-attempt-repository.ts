import type { PrismaClient } from '@/generated/prisma/client';
import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import type { SignInAttemptRepository } from '@/lib/auth/sign-in-attempt-repository';

export class PrismaSignInAttemptRepository implements SignInAttemptRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(attempt: SignInAttemptRecord): Promise<void> {
    await this.prisma.signInAttempt.create({ data: attempt });
  }

  async countForClientSince(clientKey: string, since: Date): Promise<number> {
    return this.prisma.signInAttempt.count({ where: { clientKey, attemptedAt: { gte: since } } });
  }

  async countForEmailSince(email: string, since: Date): Promise<number> {
    return this.prisma.signInAttempt.count({ where: { email, attemptedAt: { gte: since } } });
  }
}
