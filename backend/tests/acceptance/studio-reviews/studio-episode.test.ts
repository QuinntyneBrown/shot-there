import { describe, expect, it } from 'vitest';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-013 studio video embed', () => {
  it('Given a studio with a stored YouTube video ID, when returned, then the episode carries the video ID and title', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 's', videoId: 'dQw4w9WgXcQ', episodeTitle: 'We shot at The Junction Loft' })],
    });

    const { body } = await getStudioPage('s');

    expect(body.episode).toEqual({ videoId: 'dQw4w9WgXcQ', title: 'We shot at The Junction Loft' });
  });

  it('Given a studio with no video ID, when returned, then the episode is null', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 's', videoId: null, episodeTitle: 'Orphan title' })] });

    const { body } = await getStudioPage('s');

    expect(body.episode).toBeNull();
  });
});
