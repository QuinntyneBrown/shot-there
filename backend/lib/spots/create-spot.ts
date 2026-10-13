import { getDependencies } from '@/lib/data/dependency-container';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';
import type { SpotInput } from '@/lib/spots/spot-input';
import type { SpotRecord } from '@/lib/spots/spot-record';

/** Creates a draft spot with a unique slug from its name; permits are verified today unless the owner says otherwise. */
export async function createSpot(input: SpotInput): Promise<SpotRecord> {
  const { spots, clock } = getDependencies();
  const { permitVerifiedAt, slug, videoLink, ...fields } = input;
  const spot: SpotRecord = {
    ...fields,
    id: crypto.randomUUID(),
    slug: await assignUniqueSlug(slug ?? input.name, 'spot', (candidate) => spots.isSlugTaken(candidate)),
    status: 'draft',
    permitVerifiedAt: permitVerifiedAt ?? clock.today(),
    videoId: videoLink,
    publishedAt: null,
    updatedAt: clock.now(),
    images: [],
  };
  await spots.save(spot);
  return spot;
}
