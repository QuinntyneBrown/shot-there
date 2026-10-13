import { getDependencies } from '@/lib/data/dependency-container';
import { validationFailed } from '@/lib/http/validation-failed';
import { refuseImagesOnCreate } from '@/lib/images/refuse-images-on-create';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';
import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';
import { studioFieldsOf } from '@/lib/studios/studio-fields-of';

/**
 * Creates a draft studio. A slug derived from the name is made unique; an explicit slug must be free. Pricing is
 * verified today unless the owner says otherwise.
 */
export async function createStudio(input: StudioInput): Promise<StudioRecord> {
  const { studios, clock } = getDependencies();
  refuseImagesOnCreate({ testShots: input.testShots, gallery: input.gallery });
  if (input.slug !== undefined && (await studios.isSlugTaken(input.slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another studio' }]);
  }
  const studio: StudioRecord = {
    ...studioFieldsOf(input),
    id: crypto.randomUUID(),
    slug: input.slug ?? (await assignUniqueSlug(input.name, 'studio', (slug) => studios.isSlugTaken(slug))),
    status: 'draft',
    priceVerifiedAt: input.priceVerifiedAt ?? clock.today(),
    ogImageUrl: null,
    publishedAt: null,
    updatedAt: clock.now(),
    images: [],
  };
  await studios.save(studio);
  return studio;
}
