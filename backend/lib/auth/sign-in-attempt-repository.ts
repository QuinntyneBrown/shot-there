import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';

export interface SignInAttemptRepository {
  add(attempt: SignInAttemptRecord): Promise<void>;
}
