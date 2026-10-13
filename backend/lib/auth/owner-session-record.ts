export interface OwnerSessionRecord {
  id: string;
  ownerId: string;
  /** SHA-256 of the raw cookie token; the raw token is never stored. */
  tokenHash: string;
  csrfToken: string;
  createdAt: Date;
  lastSeenAt: Date;
}
