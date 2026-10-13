import { getDependencies } from '@/lib/data/dependency-container';

const WINDOW_MS = 15 * 60_000;
const MAX_CLIENT_FAILURES = 5;
const MAX_ACCOUNT_FAILURES = 10;

/** True when the client or the account has reached its failed-attempt limit in the last 15 minutes. */
export async function isSignInRateLimited(clientKey: string, email: string): Promise<boolean> {
  const { signInAttempts, clock } = getDependencies();
  const since = new Date(clock.now().getTime() - WINDOW_MS);
  const [clientFailures, accountFailures] = await Promise.all([
    signInAttempts.countForClientSince(clientKey, since),
    signInAttempts.countForEmailSince(email, since),
  ]);
  return clientFailures >= MAX_CLIENT_FAILURES || accountFailures >= MAX_ACCOUNT_FAILURES;
}
