import { getDependencies } from '@/lib/data/dependency-container';
import { validationFailed } from '@/lib/http/validation-failed';
import { applyImageOrder } from '@/lib/images/apply-image-order';
import { checkStudioPublishable } from '@/lib/publishing/check-publishable';
import { refuseIncompletePublishedSave } from '@/lib/publishing/refuse-incomplete-published-save';
import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';

/**
 * Replaces the studio's editable fields, fees and gear, and the order and alt text of the images listed. The price verified date and the slug change only when the input
 * carries them; a published studio's old slug then redirects to the new one. Null when no studio has the id.
 */
export async function updateStudio(id: string, input: StudioInput): Promise<StudioRecord | null> {
  const { studios, slugRedirects, clock } = getDependencies();
  const stored = await studios.findById(id);
  if (!stored) return null;

  const { priceVerifiedAt, slug = stored.slug, videoLink, images, ...fields } = input;
  const slugChanged = slug !== stored.slug;
  if (slugChanged && (await studios.isSlugTaken(slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another studio' }]);
  }

  const studio: StudioRecord = {
    ...stored,
    ...fields,
    slug,
    videoId: videoLink,
    images: applyImageOrder(stored.images, images),
    priceVerifiedAt: priceVerifiedAt ?? stored.priceVerifiedAt,
    updatedAt: clock.now(),
  };
  refuseIncompletePublishedSave(stored.status === 'published', checkStudioPublishable(studio));
  await studios.save(studio);
  if (slugChanged && stored.status === 'published') await slugRedirects.recordChange('studio', stored.slug, slug);
  return studio;
}
