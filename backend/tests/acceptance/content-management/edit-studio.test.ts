import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { GET as getStudioForEdit, PUT as updateStudio } from '@/app/api/admin/studios/[id]/route';
import { POST as createStudio } from '@/app/api/admin/studios/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aStudio } from '@/tests/support/builders';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { aStudioInput } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const TODAY = '2026-10-13';

function studiosOf(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.studios as InMemoryStudioRepository).rows;
}

const create = (body: unknown, signedIn = true) =>
  createStudio(adminRequest('/api/admin/studios', { method: 'POST', body, signedIn }));
const update = (id: string, body: unknown) =>
  updateStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'PUT', body }), idParams(id));
const errorFields = async (response: Response): Promise<[string, string][]> =>
  (await response.json()).errors.map((error: { field: string; message: string }) => [error.field, error.message]);

describe('L2-054 studio editor: create', () => {
  it('Given the required basics only, when the owner saves a new studio, then it is created as a draft with the slug from its name', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create({ name: 'The Junction Loft' });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ name: 'The Junction Loft', slug: 'the-junction-loft', status: 'draft' });
    expect(studiosOf(dependencies)).toHaveLength(1);
  });

  it('Given a full editor body, when the owner creates the studio, then every field, fee and gear item is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput());

    expect(response.status).toBe(201);
    expect(studiosOf(dependencies)[0]).toMatchObject({
      hourlyRate: 60,
      loadIn: 'freightElevator',
      scoreLight: 5,
      fees: [{ name: 'Cleaning', amount: 25, mandatory: true }],
      gear: [{ name: 'Profoto B10', category: 'lights', quantity: 2, included: true, extraCost: null }],
    });
  });

  it('Given a slug collision on create, when saving, then the server appends a numeric suffix and returns the final slug', async () => {
    useSignedInOwner({
      today: TODAY,
      studios: [aStudio({ slug: 'the-junction-loft' }), aStudio({ slug: 'the-junction-loft-2', status: 'draft' })],
    });

    const studio = await (await create({ name: 'The Junction Loft' })).json();

    expect(studio.slug).toBe('the-junction-loft-3');
  });

  it('Given no price verified date, when a studio is created, then its price last-verified date is the creation date (L2-042)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    await create({ name: 'Loft' });

    expect(studiosOf(dependencies)[0].priceVerifiedAt).toBe(TODAY);
  });

  it('Given no owner session, when a studio is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create({ name: 'Loft' }, false);

    expect(response.status).toBe(401);
    expect(studiosOf(dependencies)).toHaveLength(0);
  });
});

describe('L2-054 and L2-078 studio editor validation', () => {
  it.each([
    [{ hourlyRate: -5 }, 'hourlyRate', 'Enter an amount of 0 or more'],
    [{ scoreLight: 6 }, 'scoreLight', 'Enter a whole number from 1 to 5'],
    [{ scoreValue: 3.5 }, 'scoreValue', 'Enter a whole number from 1 to 5'],
    [{ bookingUrl: 'ftp://studio.example' }, 'bookingUrl', 'Enter a valid web address starting with http:// or https://'],
    [{ priceVerifiedAt: '2026-10-14' }, 'priceVerifiedAt', 'The price verified date cannot be in the future'],
    [{ fees: [{ name: 'Cleaning', amount: -1, mandatory: true }] }, 'fees.0.amount', 'Enter an amount of 0 or more'],
    [{ fees: [{ name: '', amount: 5, mandatory: true }] }, 'fees.0.name', 'Enter a fee name'],
  ])('Given %o, when saving, then the save is refused with 400 naming %s', async (change, field, message) => {
    const dependencies = useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput(change));

    expect(response.status).toBe(400);
    expect(await errorFields(response)).toContainEqual([field, message]);
    expect(studiosOf(dependencies)).toHaveLength(0);
  });

  it('Given a fee row without its mandatory flag, when saving, then the flag is required', async () => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput({ fees: [{ name: 'Cleaning', amount: 5 }] }));

    expect(response.status).toBe(400);
    expect((await errorFields(response)).map(([field]) => field)).toContain('fees.0.mandatory');
  });

  it('Given an unknown field isSponsored, when saving, then the server responds 400 naming the field', async () => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput({ isSponsored: true }));

    expect(response.status).toBe(400);
    expect((await errorFields(response)).map(([field]) => field)).toContain('isSponsored');
  });

  it('Given hourlyRate as the string "abc", when saving, then the server responds 400 naming the field', async () => {
    useSignedInOwner({ today: TODAY });

    const response = await create(aStudioInput({ hourlyRate: 'abc' }));

    expect(response.status).toBe(400);
    expect((await errorFields(response)).map(([field]) => field)).toContain('hourlyRate');
  });
});

describe('L2-054 studio editor: read and update', () => {
  it('Given a draft studio, when the owner opens it for editing, then its stored fields are returned', async () => {
    useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', status: 'draft', name: 'Draft Loft' })] });

    const response = await getStudioForEdit(adminRequest('/api/admin/studios/s1'), idParams('s1'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 's1', name: 'Draft Loft', status: 'draft' });
  });

  it('Given a tampered id that does not exist, when the owner opens or saves it, then the response is 404 with no internal detail (L2-079)', async () => {
    useSignedInOwner({ today: TODAY });

    const read = await getStudioForEdit(adminRequest('/api/admin/studios/nope'), idParams('nope'));
    const write = await update('nope', aStudioInput());

    expect(read.status).toBe(404);
    const problem = await expectProblem(write, 'not-found', 404);
    expect(problem.detail).toBeNull();
  });

  it('Given an existing studio, when the owner saves changes, then fields, fees and gear are replaced and the slug is kept', async () => {
    const dependencies = useSignedInOwner({
      today: TODAY,
      studios: [aStudio({ id: 's1', slug: 'old-name', status: 'draft', fees: [{ name: 'Old', amount: 1, mandatory: true }] })],
    });

    const response = await update('s1', aStudioInput({ name: 'New Name', hourlyRate: 75, fees: [] }));

    expect(response.status).toBe(200);
    expect(studiosOf(dependencies)[0]).toMatchObject({ name: 'New Name', slug: 'old-name', hourlyRate: 75, fees: [] });
  });

  it('Given an edit that does not carry the price verified date, when saving, then the stored date is unchanged (L2-042)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', priceVerifiedAt: '2026-05-01' })] });

    await update('s1', aStudioInput({ whoItsFor: 'Changed' }));

    expect(studiosOf(dependencies)[0].priceVerifiedAt).toBe('2026-05-01');
  });

  it('Given an edit that confirms a new price verified date, when saving, then the date entered is saved (L2-042)', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', priceVerifiedAt: '2026-05-01' })] });

    await update('s1', aStudioInput({ hourlyRate: 70, priceVerifiedAt: '2026-10-12' }));

    expect(studiosOf(dependencies)[0].priceVerifiedAt).toBe('2026-10-12');
  });

  it('Given an edit, when saved, then the stored images are kept', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', status: 'draft' })] });
    const imagesBefore = studiosOf(dependencies)[0].images;

    await update('s1', aStudioInput());

    expect(studiosOf(dependencies)[0].images).toEqual(imagesBefore);
  });

  it('Given no owner session, when a studio is saved, then the response is 401 and nothing changes', async () => {
    const dependencies = useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', name: 'Kept' })] });

    const response = await updateStudio(
      adminRequest('/api/admin/studios/s1', { method: 'PUT', body: aStudioInput({ name: 'Changed' }), signedIn: false }),
      idParams('s1'),
    );

    expect(response.status).toBe(401);
    expect(studiosOf(dependencies)[0].name).toBe('Kept');
  });
});
