import type { SubscriberRecord } from '@/lib/subscribers/subscriber-record';

export interface SubscriberRepository {
  /** Stores the subscriber unless the email is already stored, which leaves the original row unchanged. */
  addIfAbsent(subscriber: SubscriberRecord): Promise<void>;
}
