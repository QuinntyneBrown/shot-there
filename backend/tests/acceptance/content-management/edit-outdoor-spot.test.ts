import { describe, expect, it } from 'vitest';
import { GET as getSpotForEdit, PUT as updateSpot } from '@/app/api/admin/spots/[id]/route';
import { POST as createSpot } from '@/app/api/admin/spots/route';
import { GET as findRedirect } from '@/app/api/slug-redirects/[type]/[slug]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot, anImage } from '@/tests/support/builders';
import { expectProblem } from '@/tests/support/expect-problem';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import { aSpotInput, spotSaveBody } from '@/tests/support/spot-input';

stubSiteOriginPerTest();

const TODAY = '2026-10-13';

function spotsOf(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.spots as InMemorySpotRepository).rows;
}

const create = (body: unknown, signedIn = true) =>
  createSpot(adminRequest('/api/admin/spots', { method: 'POST', body, signedIn }));
const update = async (id: string, overrides: Record<string, unknown> = {}) =>
  updateSpot(adminRequest(`/api/admin/spots/${id}`, { method: 'PUT', body: await spotSaveBody(id, overrides) }), idParams(id));
const errorsOf = async (response: Response) => (await expectProblem(response, 'validation-failed', 400)).errors;

describe('L2-055 outdoor spot editor: create (ICD E26)', () => {
  it('Given a complete body, when the owner creates a spot, then it is a draft with a Location header and the editor model', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aSpotInput());

    expect(response.status).toBe(201);
    const model = await response.json();
    expect(response.headers.get('location')).toBe(`/api/admin/spots/${model.id}`);
    expect(model).toEqual({
      id: expect.any(String),
      slug: 'riverdale-park-east',
      status: 'draft',
      publishedAt: null,
      updatedAt: expect.stringMatching(/Z$/),
      ...aSpotInput({ permitVerifiedAt: TODAY }),
    });
    expect(spotsOf(dependencies)).toHaveLength(1);
  });

  it('Given a draft with no best uses and empty light, season and permit values, when saved, then it is created', async () => {
    useSignedInOwner({ today: TODAY });
    const unfinished = aSpotInput({
      bestUses: [],
      lightByTime: {
        morning: { rating: null, note: null },
        midday: { rating: null, note: null },
        afternoon: { rating: null, note: null },
        goldenHour: { rating: null, note: null },
        blueHour: { rating: null, note: null },
      },
      lightBySeason: { spring: null, summer: null, autumn: null, winter: null },
      permits: { portrait: null, weddingEngagement: null, commercial: null, video: null },
    });

    const model = await (await create(unfinished)).json();

    expect(model).toMatchObject({
      bestUses: [],
      lightByTime: unfinished.lightByTime,
      lightBySeason: unfinished.lightBySeason,
      permits: unfinished.permits,
    });
  });

  it('Given a name already used by another spot, when created, then a numeric suffix is added', async () => {
    useSignedInOwner({ today: TODAY, spots: [aSpot({ slug: 'riverdale-park-east' })] });

    expect((await (await create(aSpotInput())).json()).slug).toBe('riverdale-park-east-2');
  });

  it('Given sample shots in a create body, when saving, then the save is refused (ICD E26)', async () => {
    useSignedInOwner({ today: TODAY });

    const errors = await errorsOf(
      await create(aSpotInput({ sampleShots: [{ imageId: 'x', alt: 'Hm', focalLengthMm: 50, angleNote: 'Low' }] })),
    );

    expect(errors).toContainEqual({ field: 'sampleShots', code: 'invalid_value', message: expect.any(String) });
  });

  it('Given no owner session, when a spot is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    expect((await create(aSpotInput(), false)).status).toBe(401);
    expect(spotsOf(dependencies)).toHaveLength(0);
  });
});

describe('L2-055 and ICD §15.2 outdoor spot validation', () => {
  it.each([
    [{ latitude: 95 }, 'latitude', 'out_of_range'],
    [{ longitude: -181 }, 'longitude', 'out_of_range'],
    [{ longitude: null }, 'longitude', 'required'],
    [{ directions: 'x'.repeat(4001) }, 'directions', 'out_of_range'],
    [{ permitSourceUrl: 'javascript:alert(1)' }, 'permitSourceUrl', 'invalid_format'],
    [{ permitVerifiedAt: '2026-10-14' }, 'permitVerifiedAt', 'date_in_future'],
    [{ type: 'rooftop' }, 'type', 'invalid_value'],
    [{ bestUses: ['portrait', 'skydiving'] }, 'bestUses.1', 'invalid_value'],
    [{ bestUses: ['portrait', 'portrait'] }, 'bestUses.1', 'duplicate'],
    [{ weekdayCrowds: 'packed' }, 'weekdayCrowds', 'invalid_value'],
    [{ permits: { portrait: 'maybe', weddingEngagement: null, commercial: null, video: null } }, 'permits.portrait', 'invalid_value'],
    [{ permits: { portrait: null, weddingEngagement: null, commercial: null, video: null, drone: 'required' } }, 'permits.drone', 'unrecognized_key'],
    [{ lightBySeason: { spring: 'x'.repeat(301), summer: null, autumn: null, winter: null } }, 'lightBySeason.spring', 'out_of_range'],
    [{ parking: 'x'.repeat(201) }, 'parking', 'out_of_range'],
    [{ episodeTitle: 'x'.repeat(151) }, 'episodeTitle', 'out_of_range'],
    [{ disclosure: 'comped', disclosureProvider: '' }, 'disclosureProvider', 'required'],
    [{ images: [] }, 'images', 'unrecognized_key'],
  ])('Given %o, when saving, then the save is refused naming %s with %s', async (change, field, code) => {
    useSignedInOwner({ today: TODAY });

    const errors = await errorsOf(await create(aSpotInput(change)));

    expect(errors).toContainEqual({ field, code, message: expect.any(String) });
  });

  it('Given a time of day the schema does not know, when saving, then the save is refused naming it', async () => {
    useSignedInOwner({ today: TODAY });
    const lightByTime = { ...(aSpotInput().lightByTime as object), noon: { rating: 'strong', note: null } };

    const errors = await errorsOf(await create(aSpotInput({ lightByTime })));

    expect(errors).toContainEqual({ field: 'lightByTime.noon', code: 'unrecognized_key', message: expect.any(String) });
  });
});

describe('L2-055 outdoor spot editor: read and update (ICD E27, E28)', () => {
  it('Given a spot with a sample shot, when the owner opens it, then the editor model carries it with its lens, angle and preview', async () => {
    const shot = anImage({ id: 'x1', role: 'sample_shot', altText: 'Bridge', focalLengthMm: 85, angleNote: 'From the steps' });
    useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', status: 'draft', images: [shot], videoId: 'dQw4w9WgXcQ' })] });

    const response = await getSpotForEdit(adminRequest('/api/admin/spots/p1'), idParams('p1'));

    expect(response.status).toBe(200);
    const model = await response.json();
    expect(model).toMatchObject({ id: 'p1', status: 'draft', videoLink: 'dQw4w9WgXcQ' });
    expect(model.sampleShots).toEqual([
      { imageId: 'x1', alt: 'Bridge', focalLengthMm: 85, angleNote: 'From the steps', preview: expect.objectContaining({ alt: 'Bridge' }) },
    ]);
  });

  it('Given an unknown id, when the owner opens or saves it, then the response is 404', async () => {
    useSignedInOwner({ today: TODAY });

    expect((await getSpotForEdit(adminRequest('/api/admin/spots/nope'), idParams('nope'))).status).toBe(404);
    expect((await update('nope')).status).toBe(404);
  });

  it('Given an edit without a permit verified date, when saved, then the stored date is unchanged and the images are kept (L2-042)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', permitVerifiedAt: '2026-05-01' })] });
    const imagesBefore = spotsOf(dependencies)[0].images;

    const response = await update('p1', { directions: 'New directions' });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'p1', directions: 'New directions', permitVerifiedAt: '2026-05-01' });
    expect(spotsOf(dependencies)[0].images).toEqual(imagesBefore);
  });

  it('Given an edit confirming a new permit verified date, when saved, then that date is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', permitVerifiedAt: '2026-05-01' })] });

    await update('p1', { permitVerifiedAt: '2026-10-10' });

    expect(spotsOf(dependencies)[0].permitVerifiedAt).toBe('2026-10-10');
  });

  it('Given a new sample shot lens and angle, when saved, then the stored image carries them', async () => {
    const shot = anImage({ id: 'x1', role: 'sample_shot', altText: 'Bridge', focalLengthMm: null, angleNote: null });
    const dependencies = useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', status: 'draft', images: [shot] })] });

    await update('p1', { sampleShots: [{ imageId: 'x1', alt: 'Bridge at dusk', focalLengthMm: 35, angleNote: 'From the path' }] });

    expect(spotsOf(dependencies)[0].images[0]).toMatchObject({ altText: 'Bridge at dusk', focalLengthMm: 35, angleNote: 'From the path' });
  });

  it("Given a published spot whose slug the owner changes, when the old slug is looked up, then it redirects to the new one (L2-075)", async () => {
    useSignedInOwner({ today: TODAY, spots: [aSpot({ id: 'p1', slug: 'old-park' })] });

    await update('p1', { slug: 'new-park' });

    const response = await findRedirect(new Request('http://localhost/api/slug-redirects/spot/old-park'), {
      params: Promise.resolve({ type: 'spot', slug: 'old-park' }),
    });
    expect((await response.json()).toSlug).toBe('new-park');
  });
});
