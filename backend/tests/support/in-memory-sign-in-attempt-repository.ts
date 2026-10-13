import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import type { SignInAttemptRepository } from '@/lib/auth/sign-in-attempt-repository';

export class InMemorySignInAttemptRepository implements SignInAttemptRepository {
  constructor(readonly rows: SignInAttemptRecord[] = []) {}

  async add(attempt: SignInAttemptRecord): Promise<void> {
    this.rows.push(structuredClone(attempt));
  }

  async countForClientSince(clientKey: string, since: Date): Promise<number> {
    return this.rows.filter((row) => row.clientKey === clientKey && row.attemptedAt >= since).length;
  }

  async countForEmailSince(email: string, since: Date): Promise<number> {
    return this.rows.filter((row) => row.email === email && row.attemptedAt >= since).length;
  }
}
