import { getDependencies } from '@/lib/data/dependency-container';
import { validationFailed } from '@/lib/http/validation-failed';
import { refuseImagesOnCreate } from '@/lib/images/refuse-images-on-create';
import { assignUniqueSlug } from '@/lib/slugs/assign-unique-slug';
import { spotFieldsOf } from '@/lib/spots/spot-fields-of';
import type { SpotInput } from '@/lib/spots/spot-input';
import type { SpotRecord } from '@/lib/spots/spot-record';

/**
 * Creates a draft spot. A slug derived from the name is made unique; an explicit slug must be free. Permits are
 * verified today unless the owner says otherwise.
 */
export async function createSpot(input: SpotInput): Promise<SpotRecord> {
  const { spots, clock } = getDependencies();
  refuseImagesOnCreate({ sampleShots: input.sampleShots });
  if (input.slug !== undefined && (await spots.isSlugTaken(input.slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another spot' }]);
  }
  const spot: SpotRecord = {
    ...spotFieldsOf(input),
    id: crypto.randomUUID(),
    slug: input.slug ?? (await assignUniqueSlug(input.name, 'spot', (candidate) => spots.isSlugTaken(candidate))),
    status: 'draft',
    permitVerifiedAt: input.permitVerifiedAt ?? clock.today(),
    publishedAt: null,
    updatedAt: clock.now(),
    images: [],
  };
  await spots.save(spot);
  return spot;
}
