import type { z } from 'zod';
import type { studioInputSchema } from '@/lib/studios/schemas';

export type StudioInput = z.output<ReturnType<typeof studioInputSchema>>;
