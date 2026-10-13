import { getDependencies } from '@/lib/data/dependency-container';
import { validationFailed } from '@/lib/http/validation-failed';
import { applyImageOrder } from '@/lib/images/apply-image-order';
import { checkSpotPublishable } from '@/lib/publishing/check-publishable';
import { refuseIncompletePublishedSave } from '@/lib/publishing/refuse-incomplete-published-save';
import type { SpotInput } from '@/lib/spots/spot-input';
import type { SpotRecord } from '@/lib/spots/spot-record';

/**
 * Replaces the spot's editable fields and permit rows, and the order and alt text of the images listed. The permit verified date and the slug change only when the input
 * carries them; a published spot's old slug then redirects to the new one. Null when no spot has the id.
 */
export async function updateSpot(id: string, input: SpotInput): Promise<SpotRecord | null> {
  const { spots, slugRedirects, clock } = getDependencies();
  const stored = await spots.findById(id);
  if (!stored) return null;

  const { permitVerifiedAt, slug = stored.slug, videoLink, images, ...fields } = input;
  const slugChanged = slug !== stored.slug;
  if (slugChanged && (await spots.isSlugTaken(slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another spot' }]);
  }

  const spot: SpotRecord = {
    ...stored,
    ...fields,
    slug,
    videoId: videoLink,
    images: applyImageOrder(stored.images, images),
    permitVerifiedAt: permitVerifiedAt ?? stored.permitVerifiedAt,
    updatedAt: clock.now(),
  };
  refuseIncompletePublishedSave(stored.status === 'published', checkSpotPublishable(spot));
  await spots.save(spot);
  if (slugChanged && stored.status === 'published') await slugRedirects.recordChange('spot', stored.slug, slug);
  return spot;
}
