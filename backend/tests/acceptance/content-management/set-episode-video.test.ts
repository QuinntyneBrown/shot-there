import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { PUT as updateSpot } from '@/app/api/admin/spots/[id]/route';
import { PUT as updateStudio } from '@/app/api/admin/studios/[id]/route';
import { GET as getPublicStudio } from '@/app/api/studios/[slug]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot, aStudio } from '@/tests/support/builders';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { aSpotInput } from '@/tests/support/spot-input';
import { aStudioInput } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const saveStudioVideo = (videoLink: unknown) =>
  updateStudio(
    adminRequest('/api/admin/studios/s1', { method: 'PUT', body: aStudioInput({ videoLink }) }),
    idParams('s1'),
  );

function storedStudio(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.studios as InMemoryStudioRepository).rows[0];
}

describe('L2-059 video link validation', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ?t=42',
    'https://m.youtube.com/watch?feature=share&v=dQw4w9WgXcQ',
    'https://youtube.com/shorts/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    '  dQw4w9WgXcQ  ',
  ])('Given the owner pastes %s, when saving, then the stored video ID is dQw4w9WgXcQ', async (videoLink) => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1' })] });

    const response = await saveStudioVideo(videoLink);

    expect(response.status).toBe(200);
    expect(storedStudio(dependencies).videoId).toBe('dQw4w9WgXcQ');
  });

  it.each(['https://example.com/video', 'https://www.youtube.com/watch?v=short', 'https://youtu.be.evil.example/dQw4w9WgXcQ'])(
    'Given the owner pastes %s, when saving, then the save is refused with invalid_video_link',
    async (videoLink) => {
      const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', videoId: 'aaaaaaaaaaa' })] });

      const response = await saveStudioVideo(videoLink);

      const problem = await expectProblem(response, 'validation-failed', 400);
      expect(problem.errors).toContainEqual({ field: 'videoLink', code: 'invalid_video_link', message: expect.any(String) });
      expect(storedStudio(dependencies).videoId).toBe('aaaaaaaaaaa');
    },
  );

  it('Given the owner clears the field, when saving, then no video ID is stored and the public page has no episode', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'loft', videoId: 'dQw4w9WgXcQ' })] });

    await saveStudioVideo('');

    expect(storedStudio(dependencies).videoId).toBeNull();
    const page = await getPublicStudio(new Request('http://localhost/api/studios/loft'), {
      params: Promise.resolve({ slug: 'loft' }),
    });
    expect((await page.json()).episode).toBeNull();
  });

  it('Given a spot, when the owner pastes a youtu.be link, then the spot stores the video ID', async () => {
    const dependencies = useSignedInOwner({ spots: [aSpot({ id: 'p1' })] });

    const response = await updateSpot(
      adminRequest('/api/admin/spots/p1', { method: 'PUT', body: aSpotInput({ videoLink: 'https://youtu.be/dQw4w9WgXcQ' }) }),
      idParams('p1'),
    );

    expect(response.status).toBe(200);
    expect((dependencies.spots as InMemorySpotRepository).rows[0].videoId).toBe('dQw4w9WgXcQ');
  });
});
