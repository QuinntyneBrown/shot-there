import type { z } from 'zod';
import type { subscribeSchema } from '@/lib/subscribers/schemas';

export type SubscribeInput = z.output<typeof subscribeSchema>;
