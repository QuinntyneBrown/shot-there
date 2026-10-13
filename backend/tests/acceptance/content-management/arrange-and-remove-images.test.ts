import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { DELETE as removeImage } from '@/app/api/admin/images/[id]/route';
import { PUT as saveSpot } from '@/app/api/admin/spots/[id]/route';
import { PUT as saveStudio } from '@/app/api/admin/studios/[id]/route';
import type { Dependencies } from '@/lib/data/dependencies';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot, aStudio, anImage } from '@/tests/support/builders';
import { captureLogs } from '@/tests/support/captured-logs';
import { getStudioPage } from '@/tests/support/get-studio-page';
import type { InMemoryObjectStore } from '@/tests/support/in-memory-object-store';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { spotSaveBody } from '@/tests/support/spot-input';
import { studioSaveBody } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const studioRows = (dependencies: Dependencies) => (dependencies.studios as InMemoryStudioRepository).rows;
const objectStore = (dependencies: Dependencies) => dependencies.objectStore as InMemoryObjectStore;
const putStudio = (id: string, body: unknown) =>
  saveStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'PUT', body }), idParams(id));
const remove = (id: string, signedIn = true) =>
  removeImage(adminRequest(`/api/admin/images/${id}`, { method: 'DELETE', signedIn }), idParams(id));

const gallery = () => [
  anImage({ id: 'a', role: 'gallery', sortOrder: 0, altText: 'Window wall' }),
  anImage({ id: 'b', role: 'gallery', sortOrder: 1, altText: 'Cyc wall' }),
  anImage({ id: 'c', role: 'gallery', sortOrder: 2, altText: 'Couch corner' }),
];

describe('L2-058 image ordering', () => {
  it('Given a gallery of three images, when the owner moves the third to first and saves, then the public page shows it first', async () => {
    useSignedInOwner({
      studios: [aStudio({ id: 's1', slug: 'loft', images: [anImage({ role: 'test_shot' }), ...gallery()] })],
    });

    const response = await putStudio(
      's1',
      await studioSaveBody('s1', {
        gallery: [
          { imageId: 'c', alt: 'Couch corner' },
          { imageId: 'a', alt: 'Window wall' },
          { imageId: 'b', alt: 'Cyc wall' },
        ],
      }),
    );

    expect(response.status).toBe(200);
    const { body } = await getStudioPage('loft');
    expect(body.gallery.map((image: { alt: string }) => image.alt)).toEqual(['Couch corner', 'Window wall', 'Cyc wall']);
  });

  it('Given an edited alt text, when saved, then the stored image carries it and the other images are unchanged', async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1', images: [anImage({ role: 'test_shot', altText: 'Test shot' }), ...gallery()] })],
    });

    await putStudio(
      's1',
      await studioSaveBody('s1', {
        gallery: [
          { imageId: 'a', alt: 'Window wall' },
          { imageId: 'b', alt: 'White cyc wall, lit' },
          { imageId: 'c', alt: 'Couch corner' },
        ],
      }),
    );

    expect(studioRows(dependencies)[0].images.map((image) => image.altText)).toEqual([
      'Test shot',
      'Window wall',
      'White cyc wall, lit',
      'Couch corner',
    ]);
  });

  it('Given a spot sample shot, when the owner saves a new order, then the spot keeps it', async () => {
    const dependencies = useSignedInOwner({
      spots: [
        aSpot({
          id: 'p1',
          images: [
            anImage({ id: 'x', role: 'sample_shot', sortOrder: 0, altText: 'Bridge' }),
            anImage({ id: 'y', role: 'sample_shot', sortOrder: 1, altText: 'Meadow' }),
          ],
        }),
      ],
    });

    const response = await saveSpot(
      adminRequest('/api/admin/spots/p1', {
        method: 'PUT',
        body: await spotSaveBody('p1', {
          sampleShots: [
            { imageId: 'y', alt: 'Meadow', focalLengthMm: 35, angleNote: 'Low' },
            { imageId: 'x', alt: 'Bridge', focalLengthMm: 85, angleNote: 'High' },
          ],
        }),
      }),
      idParams('p1'),
    );

    expect(response.status).toBe(200);
    const images = (dependencies.spots as InMemorySpotRepository).rows[0].images;
    expect(images.find((image) => image.id === 'y')?.sortOrder).toBe(0);
  });
});

describe('L2-057 alt text is required', () => {
  it('Given an uploaded image without alt text, when the owner saves the location, then the save is refused naming the image alt field with "Describe this image"', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', images: gallery() })] });

    const body = await studioSaveBody('s1', {
      gallery: [
        { imageId: 'a', alt: '  ' },
        { imageId: 'b', alt: 'Cyc wall' },
        { imageId: 'c', alt: 'Couch corner' },
      ],
    });
    const response = await putStudio('s1', body);

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: 'gallery.0.alt', code: 'required', message: 'Describe this image' }]);
    expect(studioRows(dependencies)[0].images[0].altText).toBe('Window wall');
  });

  it('Given an image id that belongs to another location, when saved, then the save is refused with 400', async () => {
    useSignedInOwner({ studios: [aStudio({ id: 's1', images: gallery() })] });

    const response = await putStudio('s1', await studioSaveBody('s1', { gallery: [{ imageId: 'elsewhere', alt: 'Hm' }] }));

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: 'gallery', code: 'invalid_value', message: expect.any(String) }]);
  });
});

describe('L2-058 image removal', () => {
  it('Given a gallery image, when the owner removes it, then it is deleted with its stored objects and no longer appears publicly', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'loft', images: [anImage({ role: 'test_shot' }), ...gallery()] })] });
    const removed = gallery()[1];
    for (const key of [removed.storageKey, ...removed.variants.map((variant) => variant.storageKey)]) {
      await objectStore(dependencies).putObject(key, Buffer.from('x'), 'image/jpeg');
    }

    const response = await remove('b');

    expect(response.status).toBe(204);
    expect(objectStore(dependencies).objects.size).toBe(0);
    const { body } = await getStudioPage('loft');
    expect(body.gallery.map((image: { alt: string }) => image.alt)).toEqual(['Window wall', 'Couch corner']);
  });

  it("Given a published studio's last standard test shot, when the owner removes it, then the removal is refused with 409 saying at least one is required while published", async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1', images: [anImage({ id: 't', role: 'test_shot' }), ...gallery()] })],
    });

    const response = await remove('t');

    await expectProblem(response, 'conflict', 409);
    expect(studioRows(dependencies)[0].images.some((image) => image.id === 't')).toBe(true);
  });

  it("Given a published spot's last sample shot, when the owner removes it, then the removal is refused with 409", async () => {
    useSignedInOwner({ spots: [aSpot({ id: 'p1', images: [anImage({ id: 'x', role: 'sample_shot' })] })] });

    expect((await remove('x')).status).toBe(409);
  });

  it("Given a draft studio's only test shot, when the owner removes it, then it is removed", async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1', status: 'draft', publishedAt: null, images: [anImage({ id: 't', role: 'test_shot' })] })],
    });

    expect((await remove('t')).status).toBe(204);
    expect(studioRows(dependencies)[0].images).toEqual([]);
  });

  it('Given the object store fails after the rows are deleted, when the owner removes an image, then the removal still succeeds and the failure is logged', async () => {
    const logs = captureLogs();
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', images: [anImage({ role: 'test_shot' }), ...gallery()] })] });
    objectStore(dependencies).deleteObjects = async () => {
      throw new Error('bucket unavailable');
    };

    const response = await remove('a');

    expect(response.status).toBe(204);
    expect(studioRows(dependencies)[0].images.some((image) => image.id === 'a')).toBe(false);
    expect(logs.find((line) => line.level === 'error')).toMatchObject({ event: 'storage.delete-failed' });
  });

  it('Given an unknown image id, when removed, then the response is 404', async () => {
    useSignedInOwner({ studios: [aStudio({ id: 's1' })] });

    expect((await remove('missing')).status).toBe(404);
  });

  it('Given no owner session, when an image is removed, then the response is 401 and the image remains', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', images: gallery() })] });

    expect((await remove('a', false)).status).toBe(401);
    expect(studioRows(dependencies)[0].images).toHaveLength(3);
  });
});
