import { getDependencies } from '@/lib/data/dependency-container';
import { currentCorrelationId } from '@/lib/logging/correlation-context';
import { log } from '@/lib/logging/logger';
import { maskEmail } from '@/lib/logging/redact';
import type { SubscribeInput } from '@/lib/subscribers/subscribe-input';

/** Stores a new subscriber; a filled honeypot stores nothing and a repeat address leaves the original row. */
export async function subscribe({ email, sourcePath, website }: SubscribeInput): Promise<void> {
  if (website) return;
  const { subscribers, clock } = getDependencies();
  const normalised = email.toLowerCase();
  await subscribers.addIfAbsent({ email: normalised, subscribedAt: clock.now(), sourcePath });
  log('info', currentCorrelationId(), { event: 'subscriber.signup', email: maskEmail(normalised) });
}
