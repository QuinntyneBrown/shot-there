import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideInput } from '@/lib/guides/guide-input';
import type { GuideRecord } from '@/lib/guides/guide-record';
import { requireEntryLocations } from '@/lib/guides/require-entry-locations';
import { validationFailed } from '@/lib/http/validation-failed';

/**
 * Replaces the guide's title, introduction and entries. The slug changes only when the input carries it; a published
 * guide's old slug then redirects to the new one. Null when no guide has the id.
 */
export async function updateGuide(id: string, input: GuideInput): Promise<GuideRecord | null> {
  const { guides, slugRedirects, clock } = getDependencies();
  const stored = await guides.findById(id);
  if (!stored) return null;

  const slug = input.slug ?? stored.slug;
  const slugChanged = slug !== stored.slug;
  if (slugChanged && (await guides.isSlugTaken(slug))) {
    throw validationFailed([{ field: 'slug', message: 'This address is already used by another guide' }]);
  }
  await requireEntryLocations(input.entries);

  const guide: GuideRecord = {
    ...stored,
    slug,
    title: input.title,
    introduction: input.introduction,
    entries: input.entries,
    updatedAt: clock.now(),
  };
  await guides.save(guide);
  if (slugChanged && stored.status === 'published') await slugRedirects.recordChange('guide', stored.slug, slug);
  return guide;
}
