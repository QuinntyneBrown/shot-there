import { z } from 'zod';
import { nullableText, requiredText, slugField, uniqueBy } from '@/lib/http/input-fields';

const DUPLICATE_MESSAGE = { studio: 'This studio is already in the guide', spot: 'This spot is already in the guide' };

const guideEntryInputSchema = z.strictObject({
  kind: z.enum(['studio', 'spot'], { error: 'Choose a studio or a spot' }),
  locationId: z.string({ error: 'Choose a studio or a spot' }).min(1, { error: 'Choose a studio or a spot' }).max(64),
  note: nullableText(1000),
});

/** The owner's guide save body (ICD §13.12, §15.3). Array order of `entries` is the configured order. */
export const guideInputSchema = z.strictObject({
  title: requiredText('Enter a title', 150),
  slug: slugField(),
  summary: nullableText(300),
  introduction: nullableText(5000),
  dataPoints: z
    .array(z.enum(['all_in_cost_2h', 'overall_score'], { error: 'Choose a listed data point' }))
    .superRefine(uniqueBy((key) => key, null, 'This data point is already selected')),
  entries: z
    .array(guideEntryInputSchema)
    .max(50, { error: 'Use 50 entries or fewer' })
    .superRefine((entries, context) => {
      const seen = new Set<string>();
      entries.forEach((entry, index) => {
        const key = `${entry.kind}:${entry.locationId}`;
        if (seen.has(key)) {
          context.addIssue({
            code: 'custom',
            message: DUPLICATE_MESSAGE[entry.kind],
            path: [index, 'locationId'],
            params: { code: 'duplicate' },
          });
        }
        seen.add(key);
      });
    }),
});
