import { getDependencies } from '@/lib/data/dependency-container';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';
import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** Creates a draft studio with a unique slug from its name; pricing is verified today unless the owner says otherwise. */
export async function createStudio(input: StudioInput): Promise<StudioRecord> {
  const { studios, clock } = getDependencies();
  const { priceVerifiedAt, slug, videoLink, images: _images, ...fields } = input;
  const studio: StudioRecord = {
    ...fields,
    id: crypto.randomUUID(),
    slug: await assignUniqueSlug(slug ?? input.name, 'studio', (slug) => studios.isSlugTaken(slug)),
    status: 'draft',
    priceVerifiedAt: priceVerifiedAt ?? clock.today(),
    videoId: videoLink,
    ogImageUrl: null,
    publishedAt: null,
    updatedAt: clock.now(),
    images: [],
  };
  await studios.save(studio);
  return studio;
}
