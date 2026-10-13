import type { z } from 'zod';
import type { Disclosure } from '@/lib/publishing/disclosure';

/** A superRefine check that a discounted or comped session names who provided it (L2-045). */
export function requireDisclosureProvider(
  location: { disclosure: Disclosure | null; disclosureProvider: string | null },
  context: z.RefinementCtx,
): void {
  const needsProvider = location.disclosure === 'discounted' || location.disclosure === 'comped';
  if (needsProvider && !location.disclosureProvider) {
    context.addIssue({
      code: 'custom',
      path: ['disclosureProvider'],
      message: 'The provider is required for a discounted or comped session',
    });
  }
}
