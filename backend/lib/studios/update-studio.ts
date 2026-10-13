import { getDependencies } from '@/lib/data/dependency-container';
import { validationFailed } from '@/lib/http/validation-failed';
import { applyImageLists } from '@/lib/images/apply-image-lists';
import { checkStudioPublishable } from '@/lib/publishing/check-publishable';
import { refuseIncompletePublishedSave } from '@/lib/publishing/refuse-incomplete-published-save';
import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';
import { studioFieldsOf } from '@/lib/studios/studio-fields-of';

/**
 * Replaces the studio's editable fields, fees and gear, and the order, alt text and captions of its images. The price
 * verified date and the slug change only when the input carries them; a published studio's old slug then redirects to
 * the new one. Null when no studio has the id.
 */
export async function updateStudio(id: string, input: StudioInput): Promise<StudioRecord | null> {
  const { studios, slugRedirects, clock } = getDependencies();
  const stored = await studios.findById(id);
  if (!stored) return null;

  const { priceVerifiedAt, slug = stored.slug } = input;
  const slugChanged = slug !== stored.slug;
  if (slugChanged && (await studios.isSlugTaken(slug))) {
    throw validationFailed([{ field: 'slug', code: 'already_in_use', message: 'This address is already used by another studio' }]);
  }

  const studio: StudioRecord = {
    ...stored,
    ...studioFieldsOf(input),
    slug,
    images: applyImageLists(stored.images, [
      { field: 'testShots', role: 'test_shot', items: input.testShots },
      { field: 'gallery', role: 'gallery', items: input.gallery },
    ]),
    priceVerifiedAt: priceVerifiedAt ?? stored.priceVerifiedAt,
    updatedAt: clock.now(),
  };
  refuseIncompletePublishedSave(stored.status === 'published', checkStudioPublishable(studio));
  await studios.save(studio);
  if (slugChanged && stored.status === 'published') await slugRedirects.recordChange('studio', stored.slug, slug);
  return studio;
}
