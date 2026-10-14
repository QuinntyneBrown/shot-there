import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z.string({ error: 'Enter your email address' }).trim().max(254).pipe(z.email('Enter a valid email address')),
    password: z.string({ error: 'Enter your password' }).trim().min(1, 'Enter your password').max(200),
  })
  .strict();
