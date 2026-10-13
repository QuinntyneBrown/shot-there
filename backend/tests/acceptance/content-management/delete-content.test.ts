import { describe, expect, it } from 'vitest';
import { DELETE as deleteGuide } from '@/app/api/admin/guides/[id]/route';
import { DELETE as deleteSpot } from '@/app/api/admin/spots/[id]/route';
import { DELETE as deleteStudio } from '@/app/api/admin/studios/[id]/route';
import type { Dependencies } from '@/lib/data/dependencies';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aGuide, aSpot, aStudio, anImage } from '@/tests/support/builders';
import { captureLogs } from '@/tests/support/captured-logs';
import type { InMemoryGuideRepository } from '@/tests/support/in-memory-guide-repository';
import type { InMemoryObjectStore } from '@/tests/support/in-memory-object-store';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';

stubSiteOriginPerTest();

const studioRows = (dependencies: Dependencies) => (dependencies.studios as InMemoryStudioRepository).rows;
const spotRows = (dependencies: Dependencies) => (dependencies.spots as InMemorySpotRepository).rows;
const guideRows = (dependencies: Dependencies) => (dependencies.guides as InMemoryGuideRepository).rows;
const objectStore = (dependencies: Dependencies) => dependencies.objectStore as InMemoryObjectStore;
const removeStudio = (id: string, signedIn = true) =>
  deleteStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'DELETE', signedIn }), idParams(id));
const removeSpot = (id: string) => deleteSpot(adminRequest(`/api/admin/spots/${id}`, { method: 'DELETE' }), idParams(id));
const removeGuide = (id: string) => deleteGuide(adminRequest(`/api/admin/guides/${id}`, { method: 'DELETE' }), idParams(id));

const draft = { status: 'draft' as const, publishedAt: null };

async function storeImageObjects(dependencies: Dependencies, ...images: ReturnType<typeof anImage>[]) {
  for (const image of images) {
    for (const key of [image.storageKey, ...image.variants.map((variant) => variant.storageKey)]) {
      await objectStore(dependencies).putObject(key, Buffer.from('x'), 'image/jpeg');
    }
  }
}

describe('L2-061 delete a draft studio', () => {
  it('Given a draft studio, when the owner deletes it, then the studio and its images are deleted', async () => {
    const images = [anImage({ role: 'testShot' }), anImage({ role: 'gallery' })];
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', ...draft, images }), aStudio({ id: 's2' })] });
    await storeImageObjects(dependencies, ...images);

    const response = await removeStudio('s1');

    expect(response.status).toBe(204);
    expect(studioRows(dependencies).map((studio) => studio.id)).toEqual(['s2']);
    expect(objectStore(dependencies).objects.size).toBe(0);
  });

  it('Given a published studio, when the owner deletes it, then deletion is refused with 409 and the studio remains', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1' })] });

    const response = await removeStudio('s1');

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ status: 409, message: 'Unpublish before deleting' });
    expect(studioRows(dependencies)).toHaveLength(1);
  });

  it('Given a studio referenced by a guide entry, when it is deleted, then the guide entry is removed and the guide remains', async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1', ...draft }), aStudio({ id: 's2' })],
      guides: [
        aGuide({
          id: 'g1',
          entries: [
            { kind: 'studio', locationId: 's1', note: '', position: 0 },
            { kind: 'studio', locationId: 's2', note: '', position: 1 },
          ],
        }),
      ],
    });

    expect((await removeStudio('s1')).status).toBe(204);

    expect(guideRows(dependencies)).toHaveLength(1);
    expect(guideRows(dependencies)[0].entries.map((entry) => entry.locationId)).toEqual(['s2']);
  });

  it('Given the object store fails after the studio is deleted, when the owner deletes it, then deletion still succeeds and the failure is logged', async () => {
    const logs = captureLogs();
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', ...draft })] });
    objectStore(dependencies).deleteObjects = async () => {
      throw new Error('bucket unavailable');
    };

    expect((await removeStudio('s1')).status).toBe(204);

    expect(studioRows(dependencies)).toEqual([]);
    expect(logs.find((line) => line.level === 'error')).toMatchObject({ event: 'storage.delete-failed' });
  });

  it('Given an unknown studio id, when deleted, then the response is 404', async () => {
    useSignedInOwner();

    expect((await removeStudio('missing')).status).toBe(404);
  });

  it('Given no owner session, when a studio is deleted, then the response is 401 and nothing is deleted', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', ...draft })] });

    expect((await removeStudio('s1', false)).status).toBe(401);
    expect(studioRows(dependencies)).toHaveLength(1);
  });
});

describe('L2-061 delete a draft spot', () => {
  it('Given a draft spot referenced by a guide, when the owner deletes it, then the spot, its images and the guide entry are deleted', async () => {
    const image = anImage({ role: 'sampleShot' });
    const dependencies = useSignedInOwner({
      spots: [aSpot({ id: 'p1', ...draft, images: [image] })],
      guides: [aGuide({ id: 'g1', entries: [{ kind: 'spot', locationId: 'p1', note: '', position: 0 }] })],
    });
    await storeImageObjects(dependencies, image);

    expect((await removeSpot('p1')).status).toBe(204);

    expect(spotRows(dependencies)).toEqual([]);
    expect(objectStore(dependencies).objects.size).toBe(0);
    expect(guideRows(dependencies)[0].entries).toEqual([]);
  });

  it('Given a published spot, when the owner deletes it, then deletion is refused with 409', async () => {
    const dependencies = useSignedInOwner({ spots: [aSpot({ id: 'p1' })] });

    expect((await removeSpot('p1')).status).toBe(409);
    expect(spotRows(dependencies)).toHaveLength(1);
  });
});

describe('L2-061 delete a draft guide', () => {
  it('Given a draft guide, when the owner deletes it, then it is deleted with its entries', async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1' })],
      guides: [aGuide({ id: 'g1', ...draft, entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] })],
    });

    expect((await removeGuide('g1')).status).toBe(204);

    expect(guideRows(dependencies)).toEqual([]);
    expect(studioRows(dependencies)).toHaveLength(1);
  });

  it('Given a published guide, when the owner deletes it, then deletion is refused with 409', async () => {
    const dependencies = useSignedInOwner({ guides: [aGuide({ id: 'g1' })] });

    expect((await removeGuide('g1')).status).toBe(409);
    expect(guideRows(dependencies)).toHaveLength(1);
  });

  it('Given an unknown guide id, when deleted, then the response is 404', async () => {
    useSignedInOwner();

    expect((await removeGuide('missing')).status).toBe(404);
  });
});
