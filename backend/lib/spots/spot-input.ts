import type { z } from 'zod';
import type { spotInputSchema } from '@/lib/spots/schemas';

export type SpotInput = z.output<ReturnType<typeof spotInputSchema>>;
