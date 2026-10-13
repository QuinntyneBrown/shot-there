import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { PUT as updateSpot } from '@/app/api/admin/spots/[id]/route';
import { POST as createStudio } from '@/app/api/admin/studios/route';
import { PUT as updateStudio } from '@/app/api/admin/studios/[id]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aSpot, aStudio } from '@/tests/support/builders';
import type { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { spotSaveBody } from '@/tests/support/spot-input';
import { aStudioInput, studioSaveBody } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const create = (body: unknown) => createStudio(adminRequest('/api/admin/studios', { method: 'POST', body }));
const saveStudio = (id: string, body: unknown) =>
  updateStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'PUT', body }), idParams(id));

describe('L2-045 disclosure values on save', () => {
  it.each(['comped', 'discounted'])(
    'Given the owner sets disclosure to %s without a provider name, when saving, then the save is refused because the provider is required',
    async (disclosure) => {
      useSignedInOwner();

      const response = await create(aStudioInput({ disclosure, disclosureProvider: null }));

      const problem = await expectProblem(response, 'validation-failed', 400);
      expect(problem.errors).toContainEqual({ field: 'disclosureProvider', code: 'required', message: expect.any(String) });
    },
  );

  it('Given the owner sets disclosure to paid_in_full, when saving, then no provider is required and the save succeeds', async () => {
    useSignedInOwner();

    const response = await create(aStudioInput({ disclosure: 'paid_in_full', disclosureProvider: null }));

    expect(response.status).toBe(201);
  });

  it('Given a comped spot without a provider, when saving, then the save is refused naming disclosureProvider', async () => {
    useSignedInOwner({ spots: [aSpot({ id: 'p1', status: 'draft' })] });

    const response = await updateSpot(
      adminRequest('/api/admin/spots/p1', { method: 'PUT', body: await spotSaveBody('p1', { disclosure: 'comped', disclosureProvider: '' }) }),
      idParams('p1'),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).errors.map((error: { field: string }) => error.field)).toContain('disclosureProvider');
  });
});

describe('L2-002 a published location keeps its standard data set', () => {
  it('Given a published studio, when the owner clears its ceiling height and saves, then the save is refused naming the field and the studio stays published with its previous value', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', ceilingHeightM: 3.4 })] });

    const response = await saveStudio('s1', await studioSaveBody('s1', { ceilingHeight: null }));

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: 'ceilingHeight', code: 'required_while_published', message: expect.any(String) }]);
    const [stored] = (dependencies.studios as InMemoryStudioRepository).rows;
    expect(stored).toMatchObject({ status: 'published', ceilingHeightM: 3.4 });
  });

  it('Given a draft studio, when the owner clears its ceiling height and saves, then the save succeeds', async () => {
    useSignedInOwner({ studios: [aStudio({ id: 's1', status: 'draft' })] });

    expect((await saveStudio('s1', await studioSaveBody('s1', { ceilingHeight: null }))).status).toBe(200);
  });

  it('Given a published spot, when the owner removes every best use and saves, then the save is refused naming bestUses', async () => {
    const dependencies = useSignedInOwner({ spots: [aSpot({ id: 'p1', bestUses: ['portrait'] })] });

    const response = await updateSpot(
      adminRequest('/api/admin/spots/p1', { method: 'PUT', body: await spotSaveBody('p1', { bestUses: [] }) }),
      idParams('p1'),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).errors.map((error: { field: string }) => error.field)).toEqual(['bestUses']);
    expect((dependencies.spots as InMemorySpotRepository).rows[0].bestUses).toEqual(['portrait']);
  });
});
