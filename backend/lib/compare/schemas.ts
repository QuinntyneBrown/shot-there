import { z } from 'zod';

/** `studios=a,b,c` becomes `['a', 'b', 'c']`: trimmed, non-empty, duplicates removed, at most the first 20 read. */
export const compareQuerySchema = z.object({
  studios: z
    .string()
    .optional()
    .transform((value) => [...new Set((value ?? '').split(',').map((slug) => slug.trim()).filter(Boolean))].slice(0, 20)),
});
