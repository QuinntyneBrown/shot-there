import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import type { SignInAttemptRepository } from '@/lib/auth/sign-in-attempt-repository';

export class InMemorySignInAttemptRepository implements SignInAttemptRepository {
  constructor(readonly rows: SignInAttemptRecord[] = []) {}

  async add(attempt: SignInAttemptRecord): Promise<void> {
    this.rows.push(structuredClone(attempt));
  }
}
