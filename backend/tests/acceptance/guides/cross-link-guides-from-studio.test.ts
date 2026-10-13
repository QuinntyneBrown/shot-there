import { describe, expect, it } from 'vitest';
import { aGuide, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-036 cross-links to guides', () => {
  it('Given a studio in two published guides and one draft guide, when its page is requested, then featuredIn links the two published guides, most recently published first (ICD OI-9)', async () => {
    const entry = { kind: 'studio' as const, locationId: 'loft-id', note: '', position: 0 };
    useFakeDependencies({
      studios: [aStudio({ id: 'loft-id', slug: 'loft' })],
      guides: [
        aGuide({ slug: 'headshots', title: 'Best for headshots', entries: [entry], publishedAt: new Date('2026-08-01T12:00:00Z') }),
        aGuide({ slug: 'secret', title: 'Draft guide', status: 'draft', entries: [entry] }),
        aGuide({ slug: 'natural-light', title: 'Best natural light', entries: [entry], publishedAt: new Date('2026-09-01T12:00:00Z') }),
        aGuide({ slug: 'unrelated', title: 'Another guide', entries: [{ ...entry, locationId: 'other' }] }),
      ],
    });

    const { body } = await getStudioPage('loft');

    expect(body.featuredIn).toEqual([
      { slug: 'natural-light', title: 'Best natural light' },
      { slug: 'headshots', title: 'Best for headshots' },
    ]);
  });

  it('Given a studio in no guides, when its page is requested, then featuredIn is empty', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'loft' })], guides: [aGuide()] });

    const { body } = await getStudioPage('loft');

    expect(body.featuredIn).toEqual([]);
  });
});
