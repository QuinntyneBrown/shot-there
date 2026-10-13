import { z } from 'zod';

/** `studios=a,b,c` becomes `['a', 'b', 'c']`: trimmed, non-empty, duplicates removed. */
export const compareQuerySchema = z.object({
  studios: z
    .string()
    .optional()
    .transform((value) => [...new Set((value ?? '').split(',').map((slug) => slug.trim()).filter(Boolean))]),
});
