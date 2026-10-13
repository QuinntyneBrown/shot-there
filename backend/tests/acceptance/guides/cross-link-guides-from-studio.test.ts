import { describe, expect, it } from 'vitest';
import { aGuide, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-036 cross-links to guides', () => {
  it('Given a studio in two published guides and one draft guide, when its page is requested, then featuredIn links the two published guides by title', async () => {
    const entry = { kind: 'studio' as const, locationId: 'loft-id', note: '', position: 0 };
    useFakeDependencies({
      studios: [aStudio({ id: 'loft-id', slug: 'loft' })],
      guides: [
        aGuide({ slug: 'natural-light', title: 'Best natural light', entries: [entry] }),
        aGuide({ slug: 'secret', title: 'Draft guide', status: 'draft', entries: [entry] }),
        aGuide({ slug: 'headshots', title: 'Best for headshots', entries: [entry] }),
        aGuide({ slug: 'unrelated', title: 'Another guide', entries: [{ ...entry, locationId: 'other' }] }),
      ],
    });

    const { body } = await getStudioPage('loft');

    expect(body.featuredIn).toEqual([
      { slug: 'headshots', title: 'Best for headshots' },
      { slug: 'natural-light', title: 'Best natural light' },
    ]);
  });

  it('Given a studio in no guides, when its page is requested, then featuredIn is empty', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'loft' })], guides: [aGuide()] });

    const { body } = await getStudioPage('loft');

    expect(body.featuredIn).toEqual([]);
  });
});
