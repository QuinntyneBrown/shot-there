import type { PrismaClient } from '@/generated/prisma/client';
import type { SubscriberRecord } from '@/lib/subscribers/subscriber-record';
import type { SubscriberRepository } from '@/lib/subscribers/subscriber-repository';

export class PrismaSubscriberRepository implements SubscriberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async addIfAbsent(subscriber: SubscriberRecord): Promise<void> {
    await this.prisma.subscriber.upsert({ where: { email: subscriber.email }, create: subscriber, update: {} });
  }
}
