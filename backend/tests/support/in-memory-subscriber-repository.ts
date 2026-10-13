import type { SubscriberRecord } from '@/lib/subscribers/subscriber-record';
import type { SubscriberRepository } from '@/lib/subscribers/subscriber-repository';

export class InMemorySubscriberRepository implements SubscriberRepository {
  constructor(readonly rows: SubscriberRecord[] = []) {}

  async addIfAbsent(subscriber: SubscriberRecord): Promise<void> {
    if (!this.rows.some((row) => row.email === subscriber.email)) this.rows.push(structuredClone(subscriber));
  }
}
