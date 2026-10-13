import { z } from 'zod';
import { optionalText, requiredText, slugField } from '@/lib/http/input-fields';

const DUPLICATE_MESSAGE = { studio: 'This studio is already in the guide', spot: 'This spot is already in the guide' };

const guideEntryInputSchema = z.strictObject({
  kind: z.enum(['studio', 'spot'], { error: 'Choose a studio or a spot' }),
  locationId: z.string({ error: 'Choose a studio or a spot' }).min(1, { error: 'Choose a studio or a spot' }),
  note: optionalText(1000).transform((note) => note ?? ''),
  position: z
    .number({ error: 'Enter a whole number of 0 or more' })
    .int({ error: 'Enter a whole number of 0 or more' })
    .min(0, { error: 'Enter a whole number of 0 or more' }),
});

/** The owner's guide save body. Strict: unknown fields are refused, and a location may appear only once. */
export const guideInputSchema = z.strictObject({
  title: requiredText('Enter a title'),
  slug: slugField().optional(),
  introduction: optionalText(5000).transform((introduction) => introduction ?? ''),
  entries: z
    .array(guideEntryInputSchema)
    .max(100)
    .default([])
    .superRefine((entries, context) => {
      const seen = new Set<string>();
      entries.forEach((entry, index) => {
        const key = `${entry.kind}:${entry.locationId}`;
        if (seen.has(key)) {
          context.addIssue({ code: 'custom', message: DUPLICATE_MESSAGE[entry.kind], path: [index, 'locationId'] });
        }
        seen.add(key);
      });
    }),
});
