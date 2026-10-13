import type { NewOwnerSession } from '@/lib/auth/new-owner-session';

export type SignInResult =
  | { outcome: 'signedIn'; session: NewOwnerSession }
  | { outcome: 'invalidCredentials' }
  | { outcome: 'rateLimited' };
