import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { POST as upload } from '@/app/api/admin/images/route';
import type { Dependencies } from '@/lib/data/dependencies';
import { stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot, aStudio } from '@/tests/support/builders';
import type { InMemoryObjectStore } from '@/tests/support/in-memory-object-store';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { uploadRequest } from '@/tests/support/image-upload';
import { EXE_FILE, SVG_IMAGE, aRasterImage } from '@/tests/support/test-images';

stubSiteOriginPerTest();

const IMMUTABLE = 'public, max-age=31536000, immutable';
const storeOf = (dependencies: Dependencies) => (dependencies.objectStore as InMemoryObjectStore).objects;
const studioImages = (dependencies: Dependencies) => (dependencies.studios as InMemoryStudioRepository).rows[0].images;

function useStudioEditor() {
  return useSignedInOwner({ studios: [aStudio({ id: 's1', images: [] })] });
}

describe('L2-057 image upload', () => {
  it('Given a large JPEG, when the owner uploads it to a studio gallery, then the original and variants at 480, 960, 1440 and 2048 px are stored in AVIF, WebP and JPEG', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(uploadRequest({ file: await aRasterImage(2400, 1600), studioId: 's1' }));

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ role: 'gallery', width: 2400, height: 1600, altText: '', contentType: 'image/jpeg' });
    const store = storeOf(dependencies);
    expect(store.get(`images/${body.id}/original`)?.contentType).toBe('image/jpeg');
    for (const width of [480, 960, 1440, 2048]) {
      expect(store.get(`images/${body.id}/${width}.avif`)).toMatchObject({ contentType: 'image/avif', cacheControl: IMMUTABLE });
      expect(store.get(`images/${body.id}/${width}.webp`)).toMatchObject({ contentType: 'image/webp', cacheControl: IMMUTABLE });
      expect(store.get(`images/${body.id}/${width}.jpg`)).toMatchObject({ contentType: 'image/jpeg', cacheControl: IMMUTABLE });
    }
    expect(store.size).toBe(13);
    const [stored] = studioImages(dependencies);
    expect(stored).toMatchObject({ id: body.id, role: 'gallery', width: 2400, height: 1600 });
    expect(stored.variants).toHaveLength(12);
  }, 60_000);

  it('Given an image narrower than 2048 px, when uploaded, then no variant wider than the source is generated', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(uploadRequest({ file: await aRasterImage(1000, 700), studioId: 's1' }));

    expect(response.status).toBe(201);
    const widths = new Set(studioImages(dependencies)[0].variants.map((variant) => variant.width));
    expect([...widths].sort((a, b) => a - b)).toEqual([480, 960]);
  });

  it('Given a second upload of the same role, when stored, then it is ordered after the first', async () => {
    const dependencies = useStudioEditor();

    await upload(uploadRequest({ file: await aRasterImage(600, 400), studioId: 's1', role: 'testShot' }));
    await upload(uploadRequest({ file: await aRasterImage(600, 400), studioId: 's1', role: 'testShot' }));

    expect(studioImages(dependencies).map((image) => image.sortOrder)).toEqual([0, 1]);
  });

  it('Given a PNG declared as PNG, when uploaded to a spot as a sample shot, then it is stored with the inspected content type', async () => {
    const dependencies = useSignedInOwner({ spots: [aSpot({ id: 'p1', images: [] })] });

    const response = await upload(
      uploadRequest({
        file: await aRasterImage(600, 400, 'png'),
        fileName: 'shot.png',
        type: 'image/png',
        spotId: 'p1',
        role: 'sampleShot',
      }),
    );

    expect(response.status).toBe(201);
    const [image] = (dependencies.spots as InMemorySpotRepository).rows[0].images;
    expect(image).toMatchObject({ role: 'sampleShot', contentType: 'image/png', originalName: 'shot.png' });
  });

  it('Given a file over 20 MB, when uploaded, then the server responds 413 and stores nothing', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(uploadRequest({ file: Buffer.alloc(20 * 1024 * 1024 + 1), studioId: 's1' }));

    expect(response.status).toBe(413);
    expect(storeOf(dependencies).size).toBe(0);
    expect(studioImages(dependencies)).toEqual([]);
  });

  it.each([
    { label: 'an SVG', file: SVG_IMAGE, fileName: 'logo.jpg' },
    { label: 'an executable', file: EXE_FILE, fileName: 'setup.jpg' },
  ])(
    'Given $label named as a JPEG, when uploaded, then content inspection rejects it with 400 unsupported_image_type',
    async ({ file, fileName }) => {
      const dependencies = useStudioEditor();

      const response = await upload(uploadRequest({ file, fileName, studioId: 's1' }));

      const problem = await expectProblem(response, 'validation-failed', 400);
      expect(problem.errors).toEqual([{ field: 'file', code: 'unsupported_image_type', message: expect.any(String) }]);
      expect(storeOf(dependencies).size).toBe(0);
    },
  );

  it('Given a JPEG declared as PNG, when inspected, then the upload is rejected with 400', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(
      uploadRequest({ file: await aRasterImage(600, 400), fileName: 'photo.png', type: 'image/png', studioId: 's1' }),
    );

    expect(response.status).toBe(400);
    expect(storeOf(dependencies).size).toBe(0);
  });

  it('Given an unknown role or no owning location, when uploaded, then the server responds 400', async () => {
    useStudioEditor();
    const file = await aRasterImage(600, 400);

    expect((await upload(uploadRequest({ file, role: 'banner', studioId: 's1' }))).status).toBe(400);
    expect((await upload(uploadRequest({ file }))).status).toBe(400);
  });

  it('Given a studio id that does not exist, when uploaded, then the server responds 404 and stores nothing', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(uploadRequest({ file: await aRasterImage(600, 400), studioId: 'missing' }));

    expect(response.status).toBe(404);
    expect(storeOf(dependencies).size).toBe(0);
  });
});

describe('L2-081 upload safety', () => {
  it('Given an image named ../../etc/passwd.jpg, when stored, then it is saved under a server-generated name and the original name is metadata only', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(
      uploadRequest({ file: await aRasterImage(600, 400), fileName: '../../etc/passwd.jpg', studioId: 's1' }),
    );

    expect(response.status).toBe(201);
    const keys = [...storeOf(dependencies).keys()];
    expect(keys.every((key) => /^images\/[0-9a-f-]{36}\/(original|\d+\.(avif|webp|jpg))$/.test(key))).toBe(true);
    expect(keys.some((key) => key.includes('passwd'))).toBe(false);
    expect(studioImages(dependencies)[0].originalName).toBe('../../etc/passwd.jpg');
  });

  it('Given no owner session, when an image is uploaded, then the response is 401 and nothing is stored', async () => {
    const dependencies = useStudioEditor();

    const response = await upload(
      uploadRequest({ file: await aRasterImage(600, 400), studioId: 's1', signedIn: false }),
    );

    expect(response.status).toBe(401);
    expect(storeOf(dependencies).size).toBe(0);
    expect(studioImages(dependencies)).toEqual([]);
  });
});
