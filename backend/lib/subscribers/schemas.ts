import { z } from 'zod';

export const subscribeSchema = z
  .object({
    email: z
      .string({ error: 'Enter your email address' })
      .trim()
      .min(1, 'Enter your email address')
      .max(254, 'Email addresses can be at most 254 characters')
      .pipe(z.email('Enter a valid email address')),
    sourcePath: z.string({ error: 'Send the page path' }).trim().startsWith('/', 'Source path must start with /').max(2048),
    website: z.string().trim().max(200).optional(),
  })
  .strict();
