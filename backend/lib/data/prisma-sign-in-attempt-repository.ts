import type { PrismaClient } from '@/generated/prisma/client';
import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import type { SignInAttemptRepository } from '@/lib/auth/sign-in-attempt-repository';

export class PrismaSignInAttemptRepository implements SignInAttemptRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(attempt: SignInAttemptRecord): Promise<void> {
    await this.prisma.signInAttempt.create({ data: attempt });
  }
}
