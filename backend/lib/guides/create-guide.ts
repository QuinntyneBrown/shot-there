import { getDependencies } from '@/lib/data/dependency-container';
import { guideEntriesOf } from '@/lib/guides/guide-entries-of';
import type { GuideInput } from '@/lib/guides/guide-input';
import type { GuideRecord } from '@/lib/guides/guide-record';
import { requireEntryLocations } from '@/lib/guides/require-entry-locations';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';

/** Creates a draft guide with its entries in order; a taken slug gets a numeric suffix (ICD §15.3). */
export async function createGuide(input: GuideInput): Promise<GuideRecord> {
  const { guides, clock } = getDependencies();
  const entries = guideEntriesOf(input);
  await requireEntryLocations(entries);
  const guide: GuideRecord = {
    id: crypto.randomUUID(),
    slug: await assignUniqueSlug(input.slug, 'guide', (candidate) => guides.isSlugTaken(candidate)),
    status: 'draft',
    title: input.title,
    summary: input.summary,
    introduction: input.introduction,
    dataPoints: input.dataPoints,
    publishedAt: null,
    updatedAt: clock.now(),
    entries,
  };
  await guides.save(guide);
  return guide;
}
