import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideRecord } from '@/lib/guides/guide-record';
import { affectedGuideRoutes } from '@/lib/publishing/affected-routes';
import { missingFields } from '@/lib/publishing/missing-fields';

/** Publishes the guide, or throws a 422 naming `entries` when it has none. Null when no guide has the id. */
export async function publishGuide(id: string): Promise<GuideRecord | null> {
  const { guides, pageRevalidator, clock } = getDependencies();
  const guide = await guides.findById(id);
  if (!guide) return null;
  if (guide.entries.length === 0) throw missingFields(['entries']);

  const published: GuideRecord = {
    ...guide,
    status: 'published',
    publishedAt: guide.status === 'published' ? guide.publishedAt : clock.now(),
    updatedAt: clock.now(),
  };
  await guides.save(published);
  await pageRevalidator.revalidate(affectedGuideRoutes(published.slug));
  return published;
}

/** Returns the guide to draft so it leaves the public site. Null when no guide has the id. */
export async function unpublishGuide(id: string): Promise<GuideRecord | null> {
  const { guides, pageRevalidator, clock } = getDependencies();
  const guide = await guides.findById(id);
  if (!guide) return null;

  const draft: GuideRecord = { ...guide, status: 'draft', publishedAt: null, updatedAt: clock.now() };
  await guides.save(draft);
  await pageRevalidator.revalidate(affectedGuideRoutes(draft.slug));
  return draft;
}
