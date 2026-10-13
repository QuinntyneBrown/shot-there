import { describe, expect, it } from 'vitest';
import { GET as getStudioForEdit, PUT as updateStudio } from '@/app/api/admin/studios/[id]/route';
import { POST as createStudio } from '@/app/api/admin/studios/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aStudio, anImage } from '@/tests/support/builders';
import { expectProblem } from '@/tests/support/expect-problem';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { aStudioInput, aStudioInputFor } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const TODAY = '2026-10-13';

function studiosOf(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.studios as InMemoryStudioRepository).rows;
}

const create = (body: unknown, signedIn = true) =>
  createStudio(adminRequest('/api/admin/studios', { method: 'POST', body, signedIn }));
const update = (id: string, body: unknown) =>
  updateStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'PUT', body }), idParams(id));
const errorsOf = async (response: Response) => (await expectProblem(response, 'validation-failed', 400)).errors;

describe('L2-054 studio editor: create (ICD E19)', () => {
  it('Given a complete body, when the owner creates a studio, then it is created as a draft with a Location header and the editor model', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput());

    expect(response.status).toBe(201);
    const model = await response.json();
    expect(response.headers.get('location')).toBe(`/api/admin/studios/${model.id}`);
    expect(model).toEqual({
      id: expect.any(String),
      slug: 'the-junction-loft',
      status: 'draft',
      publishedAt: null,
      updatedAt: expect.stringMatching(/Z$/),
      ...aStudioInput({ priceVerifiedAt: TODAY }),
    });
    expect(studiosOf(dependencies)).toHaveLength(1);
  });

  it('Given a body naming only the studio name, when saved, then the missing properties are each required (ICD C-7)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const errors = await errorsOf(await create({ name: 'The Junction Loft' }));

    expect(errors).toContainEqual({ field: 'hourlyRate', code: 'required', message: expect.any(String) });
    expect(errors).toContainEqual({ field: 'testShots', code: 'required', message: expect.any(String) });
    expect(studiosOf(dependencies)).toHaveLength(0);
  });

  it('Given a draft with every standard field empty, when saved, then it is created', async () => {
    useSignedInOwner({ today: TODAY });
    const empty = aStudioInput({
      neighbourhood: null,
      hourlyRate: null,
      naturalLight: { morning: null, midday: null, afternoon: null, evening: null },
      scores: { value: null, light: null, space: null, gear: null, logistics: null, condition: null },
      disclosure: null,
    });

    expect((await create(empty)).status).toBe(201);
  });

  it('Given a name-derived slug collision, when creating, then the server appends a numeric suffix', async () => {
    useSignedInOwner({
      today: TODAY,
      studios: [aStudio({ slug: 'the-junction-loft' }), aStudio({ slug: 'the-junction-loft-2', status: 'draft' })],
    });

    const studio = await (await create(aStudioInput())).json();

    expect(studio.slug).toBe('the-junction-loft-3');
  });

  it('Given an explicit slug another studio uses, when creating, then the save is refused with already_in_use (ICD §15.1)', async () => {
    useSignedInOwner({ today: TODAY, studios: [aStudio({ slug: 'taken' })] });

    const errors = await errorsOf(await create(aStudioInput({ slug: 'taken' })));

    expect(errors).toEqual([{ field: 'slug', code: 'already_in_use', message: expect.any(String) }]);
  });

  it('Given images in a create body, when saving, then the save is refused because nothing can be attached yet (ICD E19)', async () => {
    useSignedInOwner({ today: TODAY });

    const errors = await errorsOf(await create(aStudioInput({ gallery: [{ imageId: 'x', alt: 'Hm' }] })));

    expect(errors).toContainEqual({ field: 'gallery', code: 'invalid_value', message: expect.any(String) });
  });

  it('Given no owner session, when a studio is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput(), false);

    expect(response.status).toBe(401);
    expect(studiosOf(dependencies)).toHaveLength(0);
  });
});

describe('L2-054, L2-078 and ICD §15.1 studio validation', () => {
  it.each([
    [{ hourlyRate: -5 }, 'hourlyRate', 'out_of_range'],
    [{ hourlyRate: 10_001 }, 'hourlyRate', 'out_of_range'],
    [{ hourlyRate: 19.999 }, 'hourlyRate', 'invalid_format'],
    [{ hourlyRate: 'abc' }, 'hourlyRate', 'invalid_type'],
    [{ minBookingHours: 25 }, 'minBookingHours', 'out_of_range'],
    [{ name: '' }, 'name', 'required'],
    [{ name: 'x'.repeat(121) }, 'name', 'out_of_range'],
    [{ slug: 'Not A Slug' }, 'slug', 'invalid_format'],
    [{ neighbourhood: 'x'.repeat(81) }, 'neighbourhood', 'out_of_range'],
    [{ bookingUrl: 'ftp://studio.example' }, 'bookingUrl', 'invalid_format'],
    [{ latitude: 95 }, 'latitude', 'out_of_range'],
    [{ latitude: null }, 'latitude', 'required'],
    [{ priceVerifiedAt: '2026-10-14' }, 'priceVerifiedAt', 'date_in_future'],
    [{ priceVerifiedAt: 'last week' }, 'priceVerifiedAt', 'invalid_format'],
    [{ priceVerifiedAt: null }, 'priceVerifiedAt', 'required'],
    [{ usableWidth: 0 }, 'usableWidth', 'out_of_range'],
    [{ ceilingHeight: 31 }, 'ceilingHeight', 'out_of_range'],
    [{ naturalLight: { morning: 'blinding', midday: null, afternoon: null, evening: null } }, 'naturalLight.morning', 'invalid_value'],
    [{ outletCount: 101 }, 'outletCount', 'out_of_range'],
    [{ backdrops: Array.from({ length: 21 }, () => 'Paper') }, 'backdrops', 'out_of_range'],
    [{ fees: [{ name: 'Cleaning', amount: -1, mandatory: true }] }, 'fees.0.amount', 'out_of_range'],
    [{ fees: [{ name: '', amount: 5, mandatory: true }] }, 'fees.0.name', 'required'],
    [{ fees: [{ name: 'Cleaning', amount: 5 }] }, 'fees.0.mandatory', 'required'],
    [{ gear: [{ name: 'Fog', category: 'other', quantity: 1, included: false, extraCost: null }] }, 'gear.0.extraCost', 'required'],
    [{ gear: [{ name: 'Fog', category: 'other', quantity: 100, included: true, extraCost: null }] }, 'gear.0.quantity', 'out_of_range'],
    [{ transit: 'x'.repeat(301) }, 'transit', 'out_of_range'],
    [{ scores: { value: 3.5, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 } }, 'scores.value', 'invalid_type'],
    [{ scores: { value: 6, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 } }, 'scores.value', 'out_of_range'],
    [{ disclosure: 'discounted', disclosureProvider: null }, 'disclosureProvider', 'required'],
    [{ episodeTitle: 'x'.repeat(151) }, 'episodeTitle', 'out_of_range'],
    [{ isSponsored: true }, 'isSponsored', 'unrecognized_key'],
    [{ parkingNote: 'Metered' }, 'parkingNote', 'unrecognized_key'],
  ])('Given %o, when saving, then the save is refused naming %s with %s', async (change, field, code) => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const errors = await errorsOf(await create(aStudioInput(change)));

    expect(errors).toContainEqual({ field, code, message: expect.any(String) });
    expect(studiosOf(dependencies)).toHaveLength(0);
  });

  it('Given surrounding spaces and an empty optional text, when saved, then strings are trimmed and the empty one is null (ICD C-14)', async () => {
    useSignedInOwner({ today: TODAY });

    const model = await (await create(aStudioInput({ name: '  Loft  ', noise: '   ' }))).json();

    expect(model).toMatchObject({ name: 'Loft', noise: null });
  });

  it('Given no cyc wall with a condition, or paid in full with a provider, when saved, then the condition and provider are stored as null', async () => {
    useSignedInOwner({ today: TODAY });

    const model = await (
      await create(aStudioInput({ hasCycWall: false, cycWallCondition: 'scuffed', disclosure: 'paid_in_full', disclosureProvider: 'Loft' }))
    ).json();

    expect(model).toMatchObject({ cycWallCondition: null, disclosureProvider: null });
  });
});

describe('L2-054 studio editor: read and update (ICD E20, E21)', () => {
  it('Given a studio with images, when the owner opens it, then the editor model carries its image lists with previews', async () => {
    const testShot = anImage({ id: 't1', role: 'test_shot', altText: 'Key light portrait', caption: 'One strobe' });
    const gallery = anImage({ id: 'g1', role: 'gallery', altText: 'Window wall' });
    useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', status: 'draft', name: 'Draft Loft', images: [testShot, gallery] })] });

    const response = await getStudioForEdit(adminRequest('/api/admin/studios/s1'), idParams('s1'));

    expect(response.status).toBe(200);
    const model = await response.json();
    expect(model).toMatchObject({ id: 's1', name: 'Draft Loft', status: 'draft', videoLink: null });
    expect(model.testShots).toEqual([
      { imageId: 't1', alt: 'Key light portrait', caption: 'One strobe', preview: expect.objectContaining({ fallbackUrl: expect.any(String) }) },
    ]);
    expect(model.gallery).toEqual([{ imageId: 'g1', alt: 'Window wall', preview: expect.objectContaining({ alt: 'Window wall' }) }]);
    expect(model).not.toHaveProperty('ogImageUrl');
  });

  it('Given a tampered id that does not exist, when the owner opens or saves it, then the response is 404 with no internal detail (L2-079)', async () => {
    useSignedInOwner({ today: TODAY });

    const read = await getStudioForEdit(adminRequest('/api/admin/studios/nope'), idParams('nope'));
    const write = await update('nope', aStudioInput());

    expect(read.status).toBe(404);
    const problem = await expectProblem(write, 'not-found', 404);
    expect(problem.detail).toBeNull();
  });

  it('Given an existing studio, when the owner saves changes, then fields, fees and gear are replaced, the slug is kept and the model is returned', async () => {
    const studio = aStudio({ id: 's1', slug: 'old-name', status: 'draft', fees: [{ name: 'Old', amount: 1, mandatory: true }] });
    const dependencies = useSignedInOwner({ today: TODAY, studios: [studio] });

    const response = await update('s1', aStudioInputFor(studio, { name: 'New Name', hourlyRate: 75, fees: [] }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 's1', name: 'New Name', slug: 'old-name', hourlyRate: 75, fees: [] });
    expect(studiosOf(dependencies)[0]).toMatchObject({ name: 'New Name', slug: 'old-name', hourlyRate: 75, fees: [] });
  });

  it('Given an edit that does not carry the price verified date, when saving, then the stored date is unchanged (L2-042)', async () => {
    const studio = aStudio({ id: 's1', priceVerifiedAt: '2026-05-01' });
    const dependencies = useSignedInOwner({ today: TODAY, studios: [studio] });

    await update('s1', aStudioInputFor(studio, { whoItsFor: 'Changed' }));

    expect(studiosOf(dependencies)[0].priceVerifiedAt).toBe('2026-05-01');
  });

  it('Given an edit that confirms a new price verified date, when saving, then the date entered is saved (L2-042)', async () => {
    const studio = aStudio({ id: 's1', priceVerifiedAt: '2026-05-01' });
    const dependencies = useSignedInOwner({ today: TODAY, studios: [studio] });

    await update('s1', aStudioInputFor(studio, { hourlyRate: 70, priceVerifiedAt: '2026-10-12' }));

    expect(studiosOf(dependencies)[0].priceVerifiedAt).toBe('2026-10-12');
  });

  it('Given image lists that leave out an attached image, when saved, then the save is refused with invalid_value on the list (ICD E21)', async () => {
    const studio = aStudio({ id: 's1', status: 'draft' });
    useSignedInOwner({ today: TODAY, studios: [studio] });

    const errors = await errorsOf(await update('s1', aStudioInputFor(studio, { gallery: [] })));

    expect(errors).toContainEqual({ field: 'gallery', code: 'invalid_value', message: expect.any(String) });
  });

  it('Given no owner session, when a studio is saved, then the response is 401 and nothing changes', async () => {
    const studio = aStudio({ id: 's1', name: 'Kept' });
    const dependencies = useSignedInOwner({ today: TODAY, studios: [studio] });

    const response = await updateStudio(
      adminRequest('/api/admin/studios/s1', { method: 'PUT', body: aStudioInputFor(studio, { name: 'Changed' }), signedIn: false }),
      idParams('s1'),
    );

    expect(response.status).toBe(401);
    expect(studiosOf(dependencies)[0].name).toBe('Kept');
  });
});
