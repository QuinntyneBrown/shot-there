/** A failed sign-in attempt. */
export interface SignInAttemptRecord {
  clientKey: string;
  email: string;
  attemptedAt: Date;
}
