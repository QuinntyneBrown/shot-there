import type { z } from 'zod';
import type { imageOrderItemSchema } from '@/lib/images/schemas';

export type ImageOrderItem = z.output<typeof imageOrderItemSchema>;
