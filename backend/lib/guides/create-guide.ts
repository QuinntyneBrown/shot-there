import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideInput } from '@/lib/guides/guide-input';
import type { GuideRecord } from '@/lib/guides/guide-record';
import { requireEntryLocations } from '@/lib/guides/require-entry-locations';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';

/** Creates a draft guide with a unique slug from its title and its entries in order. */
export async function createGuide(input: GuideInput): Promise<GuideRecord> {
  const { guides, clock } = getDependencies();
  await requireEntryLocations(input.entries);
  const guide: GuideRecord = {
    id: crypto.randomUUID(),
    slug: await assignUniqueSlug(input.slug ?? input.title, 'guide', (candidate) => guides.isSlugTaken(candidate)),
    status: 'draft',
    title: input.title,
    summary: null,
    introduction: input.introduction,
    dataPoints: [],
    publishedAt: null,
    updatedAt: clock.now(),
    entries: input.entries,
  };
  await guides.save(guide);
  return guide;
}
