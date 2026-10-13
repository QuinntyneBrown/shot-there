import { describe, expect, it } from 'vitest';
import { GET as getSpotForEdit, PUT as updateSpot } from '@/app/api/admin/spots/[id]/route';
import { POST as createSpot } from '@/app/api/admin/spots/route';
import { GET as findRedirect } from '@/app/api/slug-redirects/[type]/[slug]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot } from '@/tests/support/builders';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import { aSpotInput } from '@/tests/support/spot-input';

stubSiteOriginPerTest();

const TODAY = '2026-10-13';

function spotsOf(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.spots as InMemorySpotRepository).rows;
}

const create = (body: unknown, signedIn = true) =>
  createSpot(adminRequest('/api/admin/spots', { method: 'POST', body, signedIn }));
const update = (id: string, body: unknown) =>
  updateSpot(adminRequest(`/api/admin/spots/${id}`, { method: 'PUT', body }), idParams(id));
const errorFields = async (response: Response): Promise<[string, string][]> =>
  (await response.json()).errors.map((error: { field: string; message: string }) => [error.field, error.message]);

describe('L2-055 outdoor spot editor: create', () => {
  it('Given a full editor body, when the owner creates a spot, then it is a draft with a slug, its permits and a permit verified date of today', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aSpotInput());

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ slug: 'riverdale-park-east', status: 'draft' });
    expect(spotsOf(dependencies)[0]).toMatchObject({
      type: 'park',
      weekendCrowds: 'high',
      permits: [
        { shootType: 'portrait', required: false },
        { shootType: 'commercial', required: true },
      ],
      permitVerifiedAt: TODAY,
      bestUses: ['portrait', 'engagement'],
      lightByTime: [
        { timeOfDay: 'morning', rating: 'medium', note: null },
        { timeOfDay: 'goldenHour', rating: 'strong', note: 'Skyline glows' },
      ],
    });
  });

  it('Given a draft with no best uses, when saved, then the save succeeds', async () => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aSpotInput({ name: 'Unfinished Spot', bestUses: [] }));

    expect(response.status).toBe(201);
  });

  it('Given a name already used by another spot, when created, then a numeric suffix is added', async () => {
    useSignedInOwner({ today: TODAY, spots: [aSpot({ slug: 'riverdale-park-east' })] });

    expect((await (await create(aSpotInput())).json()).slug).toBe('riverdale-park-east-2');
  });

  it('Given no owner session, when a spot is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    expect((await create(aSpotInput(), false)).status).toBe(401);
    expect(spotsOf(dependencies)).toHaveLength(0);
  });
});

describe('L2-055 outdoor spot editor validation', () => {
  it.each([
    [{ latitude: 95 }, 'latitude', 'Enter a latitude from -90 to 90'],
    [{ longitude: -181 }, 'longitude', 'Enter a longitude from -180 to 180'],
    [{ permitSourceUrl: 'javascript:alert(1)' }, 'permitSourceUrl', 'Enter a valid web address starting with http:// or https://'],
    [{ permitVerifiedAt: '2026-10-14' }, 'permitVerifiedAt', 'The permit verified date cannot be in the future'],
  ])('Given %o, when saving, then the save is refused naming %s', async (change, field, message) => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aSpotInput(change));

    expect(response.status).toBe(400);
    expect(await errorFields(response)).toContainEqual([field, message]);
  });

  it.each([
    [{ type: 'rooftop' }, 'type'],
    [{ bestUses: ['portrait', 'skydiving'] }, 'bestUses.1'],
    [{ weekdayCrowds: 'packed' }, 'weekdayCrowds'],
    [{ permits: [{ shootType: 'drone', required: true }] }, 'permits.0.shootType'],
    [{ lightByTime: [{ timeOfDay: 'noon', rating: 'strong', note: null }] }, 'lightByTime.0.timeOfDay'],
  ])('Given a tampered value outside a fixed set %o, when the server validates, then it responds 400 naming %s', async (change, field) => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aSpotInput(change));

    expect(response.status).toBe(400);
    expect((await errorFields(response)).map(([name]) => name)).toContain(field);
  });

  it('Given the same shoot type twice, when saving, then the save is refused naming the repeated row', async () => {
    useSignedInOwner({ today: TODAY });

    const response = await create(
      aSpotInput({ permits: [{ shootType: 'video', required: true }, { shootType: 'video', required: false }] }),
    );

    expect(response.status).toBe(400);
    expect((await errorFields(response)).map(([name]) => name)).toContain('permits.1.shootType');
  });
});

describe('L2-055 outdoor spot editor: read and update', () => {
  it('Given a draft spot, when the owner opens it for editing, then it is returned', async () => {
    useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', status: 'draft' })] });

    const response = await getSpotForEdit(adminRequest('/api/admin/spots/p1'), idParams('p1'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'p1', status: 'draft' });
  });

  it('Given an unknown id, when the owner opens or saves it, then the response is 404', async () => {
    useSignedInOwner({ today: TODAY });

    expect((await getSpotForEdit(adminRequest('/api/admin/spots/nope'), idParams('nope'))).status).toBe(404);
    expect((await update('nope', aSpotInput())).status).toBe(404);
  });

  it('Given an edit without a permit verified date, when saved, then the stored date is unchanged and the images are kept (L2-042)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', permitVerifiedAt: '2026-05-01' })] });
    const imagesBefore = spotsOf(dependencies)[0].images;

    const response = await update('p1', aSpotInput({ directions: 'New directions' }));

    expect(response.status).toBe(200);
    expect(spotsOf(dependencies)[0]).toMatchObject({ directions: 'New directions', permitVerifiedAt: '2026-05-01' });
    expect(spotsOf(dependencies)[0].images).toEqual(imagesBefore);
  });

  it('Given an edit confirming a new permit verified date, when saved, then that date is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', permitVerifiedAt: '2026-05-01' })] });

    await update('p1', aSpotInput({ permitVerifiedAt: '2026-10-10' }));

    expect(spotsOf(dependencies)[0].permitVerifiedAt).toBe('2026-10-10');
  });

  it("Given a published spot whose slug the owner changes, when the old slug is looked up, then it redirects to the new one (L2-075)", async () => {
    useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', slug: 'old-park' })] });

    await update('p1', aSpotInput({ slug: 'new-park' }));

    const response = await findRedirect(new Request('http://localhost/api/slug-redirects/spot/old-park'), {
      params: Promise.resolve({ type: 'spot', slug: 'old-park' }),
    });
    expect((await response.json()).toSlug).toBe('new-park');
  });
});
