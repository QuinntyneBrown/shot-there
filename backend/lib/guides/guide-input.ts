import type { z } from 'zod';
import type { guideInputSchema } from '@/lib/guides/schemas';

export type GuideInput = z.output<typeof guideInputSchema>;
