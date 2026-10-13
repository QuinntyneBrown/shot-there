import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { GET as searchCandidates } from '@/app/api/admin/guide-candidates/route';
import { GET as getGuideForEdit, PUT as saveGuide } from '@/app/api/admin/guides/[id]/route';
import { DELETE as unpublishGuide, POST as publishGuide } from '@/app/api/admin/guides/[id]/publish/route';
import { POST as createGuide } from '@/app/api/admin/guides/route';
import { GET as getPublicGuide } from '@/app/api/guides/[slug]/route';
import type { Dependencies } from '@/lib/data/dependencies';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';
import type { InMemoryGuideRepository } from '@/tests/support/in-memory-guide-repository';
import type { InMemorySlugRedirectRepository } from '@/tests/support/in-memory-slug-redirect-repository';
import type { RecordingPageRevalidator } from '@/tests/support/recording-page-revalidator';

stubSiteOriginPerTest();

const guideRows = (dependencies: Dependencies) => (dependencies.guides as InMemoryGuideRepository).rows;
const create = (body: unknown, signedIn = true) =>
  createGuide(adminRequest('/api/admin/guides', { method: 'POST', body, signedIn }));
const save = (id: string, body: unknown) =>
  saveGuide(adminRequest(`/api/admin/guides/${id}`, { method: 'PUT', body }), idParams(id));
const publish = (id: string) =>
  publishGuide(adminRequest(`/api/admin/guides/${id}/publish`, { method: 'POST' }), idParams(id));
const unpublish = (id: string) =>
  unpublishGuide(adminRequest(`/api/admin/guides/${id}/publish`, { method: 'DELETE' }), idParams(id));
const search = (q: string, signedIn = true) =>
  searchCandidates(adminRequest(`/api/admin/guide-candidates?q=${encodeURIComponent(q)}`, { signedIn }));
const publicGuideStatus = async (slug: string) =>
  (await getPublicGuide(new Request(`http://localhost/api/guides/${slug}`), { params: Promise.resolve({ slug }) })).status;

const studios = () => [
  aStudio({ id: 's1', name: 'The Junction Loft' }),
  aStudio({ id: 's2', name: 'Liberty Light Room' }),
];

const twoStudioEntries = [
  { kind: 'studio', locationId: 's2', note: 'Huge north windows.', position: 0 },
  { kind: 'studio', locationId: 's1', note: 'Cheapest cyc in the west end.', position: 1 },
];

describe('L2-060 create and edit a guide', () => {
  it('Given the owner creates a guide with two studio entries, when saving, then it is stored as a draft with the entries in the chosen order', async () => {
    const dependencies = useSignedInOwner({ studios: studios() });

    const response = await create({
      title: 'Best natural light under $100',
      introduction: 'Rooms where daylight does the work.',
      entries: twoStudioEntries,
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ slug: 'best-natural-light-under-100', status: 'draft' });
    expect(guideRows(dependencies)[0].entries.map((entry) => entry.locationId)).toEqual(['s2', 's1']);
  });

  it('Given a guide slug that is taken, when the owner creates another guide with the same title, then it gets a numbered slug', async () => {
    useSignedInOwner({ guides: [aGuide({ slug: 'best-for-headshots' })] });

    const response = await create({ title: 'Best for headshots', entries: [] });

    expect((await response.json()).slug).toBe('best-for-headshots-2');
  });

  it('Given the same studio twice, when the owner saves, then the second entry is refused with "This studio is already in the guide"', async () => {
    const dependencies = useSignedInOwner({ studios: studios() });

    const response = await create({
      title: 'Best for headshots',
      entries: [
        { kind: 'studio', locationId: 's1', note: '', position: 0 },
        { kind: 'studio', locationId: 's1', note: '', position: 1 },
      ],
    });

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: 'entries.1.locationId', code: 'duplicate', message: expect.any(String) }]);
    expect(guideRows(dependencies)).toEqual([]);
  });

  it('Given the same spot twice, when the owner saves, then it is refused with "This spot is already in the guide"', async () => {
    useSignedInOwner({ spots: [aSpot({ id: 'p1' })] });

    const response = await create({
      title: 'Best parks',
      entries: [
        { kind: 'spot', locationId: 'p1', note: '', position: 0 },
        { kind: 'spot', locationId: 'p1', note: '', position: 1 },
      ],
    });

    expect((await response.json()).errors[0].message).toBe('This spot is already in the guide');
  });

  it('Given an entry for a location that does not exist, when the owner saves, then the save is refused with 400', async () => {
    useSignedInOwner({ studios: studios() });

    const response = await create({
      title: 'Best for headshots',
      entries: [{ kind: 'studio', locationId: 'gone', note: '', position: 0 }],
    });

    expect(response.status).toBe(400);
    expect((await response.json()).errors[0].field).toBe('entries.0.locationId');
  });

  it('Given an existing guide, when the owner opens it, then it comes with each entry and its location name', async () => {
    useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', status: 'draft', entries: [{ kind: 'studio', locationId: 's1', note: 'Cheap', position: 0 }] })],
    });

    const response = await getGuideForEdit(adminRequest('/api/admin/guides/g1'), idParams('g1'));

    expect(response.status).toBe(200);
    expect((await response.json()).entries).toEqual([
      { kind: 'studio', locationId: 's1', note: 'Cheap', position: 0, name: 'The Junction Loft' },
    ]);
  });

  it('Given an existing guide, when the owner saves new entries and title, then they replace the old ones', async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', slug: 'old', status: 'draft', entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] })],
    });

    const response = await save('g1', { title: 'Renamed', introduction: 'New intro', entries: twoStudioEntries });

    expect(response.status).toBe(200);
    expect(guideRows(dependencies)[0]).toMatchObject({ title: 'Renamed', introduction: 'New intro', slug: 'old' });
    expect(guideRows(dependencies)[0].entries.map((entry) => entry.locationId)).toEqual(['s2', 's1']);
  });

  it("Given a published guide, when the owner changes its slug, then the old slug redirects to the new one", async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', slug: 'old-guide', entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] })],
    });

    await save('g1', { title: 'Guide', slug: 'new-guide', entries: twoStudioEntries });

    expect(await (dependencies.slugRedirects as InMemorySlugRedirectRepository).find('guide', 'old-guide')).toMatchObject({
      toSlug: 'new-guide',
    });
  });

  it('Given an unknown field, when the owner saves, then the save is refused naming it', async () => {
    useSignedInOwner();

    const response = await create({ title: 'Guide', entries: [], isSponsored: true });

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: 'isSponsored', code: 'unrecognized_key', message: expect.any(String) }]);
  });

  it('Given an unknown guide id, when opened or saved, then the response is 404', async () => {
    useSignedInOwner();

    expect((await getGuideForEdit(adminRequest('/api/admin/guides/x'), idParams('x'))).status).toBe(404);
    expect((await save('x', { title: 'Guide', entries: [] })).status).toBe(404);
  });

  it('Given no owner session, when a guide is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner();

    expect((await create({ title: 'Guide', entries: [] }, false)).status).toBe(401);
    expect(guideRows(dependencies)).toEqual([]);
  });
});

describe('L2-060 publish and unpublish a guide', () => {
  it('Given a guide with no entries, when the owner publishes it, then publishing is refused naming entries', async () => {
    const dependencies = useSignedInOwner({ guides: [aGuide({ id: 'g1', status: 'draft', publishedAt: null, entries: [] })] });

    const response = await publish('g1');

    const problem = await expectProblem(response, 'publish-incomplete', 422);
    expect(problem.missingFields).toEqual(['entries']);
    expect(guideRows(dependencies)[0].status).toBe('draft');
  });

  it('Given a draft guide with entries, when the owner publishes it, then it is public and its pages are regenerated', async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [
        aGuide({ id: 'g1', slug: 'best-light', status: 'draft', publishedAt: null, entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] }),
      ],
    });

    const response = await publish('g1');

    expect(response.status).toBe(200);
    expect(guideRows(dependencies)[0]).toMatchObject({ status: 'published', publishedAt: dependencies.clock.now() });
    expect(await publicGuideStatus('best-light')).toBe(200);
    expect((dependencies.pageRevalidator as RecordingPageRevalidator).routes).toEqual([
      ['/guides/best-light', '/guides', '/sitemap.xml'],
    ]);
  });

  it('Given a published guide, when the owner unpublishes it, then it is a draft and no longer public', async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', slug: 'best-light', entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] })],
    });

    expect((await unpublish('g1')).status).toBe(200);

    expect(guideRows(dependencies)[0]).toMatchObject({ status: 'draft', publishedAt: null });
    expect(await publicGuideStatus('best-light')).toBe(404);
  });

  it('Given an unknown guide id, when published, then the response is 404', async () => {
    useSignedInOwner();

    expect((await publish('missing')).status).toBe(404);
  });
});

describe('L2-060 entry picker', () => {
  it('Given part of a name, when the owner searches, then matching studios and spots of any status are listed regardless of case', async () => {
    useSignedInOwner({
      studios: [
        aStudio({ id: 's1', name: 'The Junction Loft', status: 'draft' }),
        aStudio({ id: 's2', name: 'Liberty Light Room' }),
      ],
      spots: [aSpot({ id: 'p1', name: 'Loft Lane Laneway' })],
    });

    const response = await search('LOFT');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      { kind: 'spot', id: 'p1', name: 'Loft Lane Laneway', neighbourhood: expect.any(String), status: 'published' },
      { kind: 'studio', id: 's1', name: 'The Junction Loft', neighbourhood: 'Leslieville', status: 'draft' },
    ]);
  });

  it('Given more than 20 matches, when the owner searches, then 20 are listed', async () => {
    useSignedInOwner({ studios: Array.from({ length: 25 }, (_, index) => aStudio({ name: `Studio ${index}` })) });

    expect(await (await search('studio')).json()).toHaveLength(20);
  });

  it('Given a blank search, when the owner searches, then nothing is listed', async () => {
    useSignedInOwner({ studios: studios() });

    expect(await (await search('  ')).json()).toEqual([]);
  });

  it('Given no owner session, when the picker searches, then the response is 401', async () => {
    useSignedInOwner({ studios: studios() });

    expect((await search('loft', false)).status).toBe(401);
  });
});
