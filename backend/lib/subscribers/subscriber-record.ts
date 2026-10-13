export interface SubscriberRecord {
  /** Lowercase. */
  email: string;
  subscribedAt: Date;
  /** The page path the signup came from. */
  sourcePath: string;
}
