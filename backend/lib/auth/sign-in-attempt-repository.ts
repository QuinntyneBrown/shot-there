import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';

export interface SignInAttemptRepository {
  add(attempt: SignInAttemptRecord): Promise<void>;
  countForClientSince(clientKey: string, since: Date): Promise<number>;
  countForEmailSince(email: string, since: Date): Promise<number>;
}
