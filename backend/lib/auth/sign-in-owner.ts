import { createOwnerSession } from '@/lib/auth/create-owner-session';
import type { SignInInput } from '@/lib/auth/sign-in-input';
import type { SignInResult } from '@/lib/auth/sign-in-result';
import { verifyPassword } from '@/lib/auth/verify-password';
import { getDependencies } from '@/lib/data/dependency-container';

/** Verifies the owner's credentials, recording a failed attempt or creating a session. */
export async function signInOwner({ email, password }: SignInInput, clientKey: string): Promise<SignInResult> {
  const { owners, signInAttempts, clock } = getDependencies();
  const normalisedEmail = email.toLowerCase();
  const owner = await owners.findByEmail(normalisedEmail);
  const verified = await verifyPassword(owner?.passwordHash ?? null, password);

  if (!owner || !verified) {
    await signInAttempts.add({ clientKey, email: normalisedEmail, attemptedAt: clock.now() });
    return { outcome: 'invalidCredentials' };
  }
  return { outcome: 'signedIn', session: await createOwnerSession(owner.id) };
}
