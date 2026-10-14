import { z } from 'zod';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugRedirectParamsSchema = z.object({
  type: z.enum(['studio', 'spot', 'guide']),
  slug: z.string().max(100).regex(SLUG_PATTERN),
});
