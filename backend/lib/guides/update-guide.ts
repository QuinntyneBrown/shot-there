import { getDependencies } from '@/lib/data/dependency-container';
import { guideEntriesOf } from '@/lib/guides/guide-entries-of';
import type { GuideInput } from '@/lib/guides/guide-input';
import type { GuideRecord } from '@/lib/guides/guide-record';
import { requireEntryLocations } from '@/lib/guides/require-entry-locations';
import { validationFailed } from '@/lib/http/validation-failed';

/**
 * Replaces the guide's editable fields and entries. A slug another guide uses is refused; a published guide's old slug
 * redirects to the new one. Null when no guide has the id.
 */
export async function updateGuide(id: string, input: GuideInput): Promise<GuideRecord | null> {
  const { guides, slugRedirects, clock } = getDependencies();
  const stored = await guides.findById(id);
  if (!stored) return null;

  const slugChanged = input.slug !== stored.slug;
  if (slugChanged && (await guides.isSlugTaken(input.slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another guide' }]);
  }
  const entries = guideEntriesOf(input);
  await requireEntryLocations(entries);

  const guide: GuideRecord = {
    ...stored,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    introduction: input.introduction,
    dataPoints: input.dataPoints,
    entries,
    updatedAt: clock.now(),
  };
  await guides.save(guide);
  if (slugChanged && stored.status === 'published') await slugRedirects.recordChange('guide', stored.slug, input.slug);
  return guide;
}
