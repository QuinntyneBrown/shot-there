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
  { kind: 'studio', locationId: 's2', note: 'Huge north windows.' },
  { kind: 'studio', locationId: 's1', note: 'Cheapest cyc in the west end.' },
];

/** A complete ICD `GuideInput`: every property present. */
const aGuideInput = (overrides: Record<string, unknown> = {}) => ({
  title: 'Best natural light under $100',
  slug: 'best-natural-light-under-100',
  summary: 'Rooms where daylight does the work.',
  introduction: 'We shot in each of these rooms.',
  dataPoints: ['all_in_cost_2h', 'overall_score'],
  entries: twoStudioEntries,
  ...overrides,
});
const errorsOf = async (response: Response) => (await expectProblem(response, 'validation-failed', 400)).errors;

describe('L2-060 create and edit a guide (ICD E33-E35)', () => {
  it('Given the owner creates a guide with two studio entries, when saving, then it is a draft with a Location header and the editor model in the chosen order', async () => {
    const dependencies = useSignedInOwner({ studios: studios() });

    const response = await create(aGuideInput());

    expect(response.status).toBe(201);
    const model = await response.json();
    expect(response.headers.get('location')).toBe(`/api/admin/guides/${model.id}`);
    expect(model).toEqual({
      id: expect.any(String),
      slug: 'best-natural-light-under-100',
      status: 'draft',
      publishedAt: null,
      updatedAt: expect.stringMatching(/Z$/),
      title: 'Best natural light under $100',
      summary: 'Rooms where daylight does the work.',
      introduction: 'We shot in each of these rooms.',
      dataPoints: ['all_in_cost_2h', 'overall_score'],
      entries: [
        { kind: 'studio', locationId: 's2', name: 'Liberty Light Room', status: 'published', note: 'Huge north windows.' },
        { kind: 'studio', locationId: 's1', name: 'The Junction Loft', status: 'published', note: 'Cheapest cyc in the west end.' },
      ],
    });
    expect(guideRows(dependencies)[0].entries.map((entry) => entry.locationId)).toEqual(['s2', 's1']);
  });

  it('Given a guide slug that is taken, when the owner creates another guide with it, then it gets a numbered slug (ICD §15.3)', async () => {
    useSignedInOwner({ studios: studios(), guides: [aGuide({ slug: 'best-for-headshots' })] });

    const response = await create(aGuideInput({ slug: 'best-for-headshots' }));

    expect((await response.json()).slug).toBe('best-for-headshots-2');
  });

  it.each([
    [{ slug: undefined }, 'slug', 'required'],
    [{ title: '' }, 'title', 'required'],
    [{ title: 'x'.repeat(151) }, 'title', 'out_of_range'],
    [{ summary: 'x'.repeat(301) }, 'summary', 'out_of_range'],
    [{ introduction: 'x'.repeat(5001) }, 'introduction', 'out_of_range'],
    [{ dataPoints: ['all_in_cost_2h', 'all_in_cost_2h'] }, 'dataPoints.1', 'duplicate'],
    [{ dataPoints: ['vibes'] }, 'dataPoints.0', 'invalid_value'],
    [{ entries: [{ kind: 'studio', locationId: 's1', note: null, position: 0 }] }, 'entries.0.position', 'unrecognized_key'],
    [{ entries: [{ kind: 'studio', locationId: 's1', note: 'x'.repeat(1001) }] }, 'entries.0.note', 'out_of_range'],
    [{ entries: Array.from({ length: 51 }, () => ({ kind: 'studio', locationId: 's1', note: null })) }, 'entries', 'out_of_range'],
    [{ isSponsored: true }, 'isSponsored', 'unrecognized_key'],
  ])('Given %o, when saving, then the save is refused naming %s with %s', async (change, field, code) => {
    const dependencies = useSignedInOwner({ studios: studios() });

    const errors = await errorsOf(await create(aGuideInput(change)));

    expect(errors).toContainEqual({ field, code, message: expect.any(String) });
    expect(guideRows(dependencies)).toEqual([]);
  });

  it('Given the same studio twice, when the owner saves, then the second entry is refused as a duplicate', async () => {
    const dependencies = useSignedInOwner({ studios: studios() });

    const response = await create(
      aGuideInput({
        entries: [
          { kind: 'studio', locationId: 's1', note: null },
          { kind: 'studio', locationId: 's1', note: null },
        ],
      }),
    );

    expect(await errorsOf(response)).toEqual([{ field: 'entries.1.locationId', code: 'duplicate', message: expect.any(String) }]);
    expect(guideRows(dependencies)).toEqual([]);
  });

  it('Given an entry for a location that does not exist, when the owner saves, then the save is refused with not_found', async () => {
    useSignedInOwner({ studios: studios() });

    const response = await create(aGuideInput({ entries: [{ kind: 'studio', locationId: 'gone', note: null }] }));

    expect(await errorsOf(response)).toEqual([{ field: 'entries.0.locationId', code: 'not_found', message: expect.any(String) }]);
  });

  it('Given an existing guide, when the owner opens it, then each entry comes with its location name and status', async () => {
    useSignedInOwner({
      studios: [aStudio({ id: 's1', name: 'The Junction Loft', status: 'draft' })],
      guides: [aGuide({ id: 'g1', status: 'draft', entries: [{ kind: 'studio', locationId: 's1', note: 'Cheap', position: 0 }] })],
    });

    const response = await getGuideForEdit(adminRequest('/api/admin/guides/g1'), idParams('g1'));

    expect(response.status).toBe(200);
    expect((await response.json()).entries).toEqual([
      { kind: 'studio', locationId: 's1', name: 'The Junction Loft', status: 'draft', note: 'Cheap' },
    ]);
  });

  it('Given an existing guide, when the owner saves new entries and title, then they replace the old ones', async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', slug: 'old', status: 'draft', entries: [{ kind: 'studio', locationId: 's1', note: null, position: 0 }] })],
    });

    const response = await save('g1', aGuideInput({ title: 'Renamed', slug: 'old', introduction: 'New intro' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'g1', title: 'Renamed', introduction: 'New intro', slug: 'old' });
    expect(guideRows(dependencies)[0].entries.map((entry) => entry.locationId)).toEqual(['s2', 's1']);
  });

  it('Given a slug another guide uses, when the owner saves, then the save is refused with already_in_use (ICD §15.3)', async () => {
    useSignedInOwner({ studios: studios(), guides: [aGuide({ id: 'g1', slug: 'mine' }), aGuide({ id: 'g2', slug: 'theirs' })] });

    expect(await errorsOf(await save('g1', aGuideInput({ slug: 'theirs' })))).toEqual([
      { field: 'slug', code: 'already_in_use', message: expect.any(String) },
    ]);
  });

  it("Given a published guide, when the owner changes its slug, then the old slug redirects to the new one", async () => {
    const dependencies = useSignedInOwner({
      studios: studios(),
      guides: [aGuide({ id: 'g1', slug: 'old-guide', entries: [{ kind: 'studio', locationId: 's1', note: null, position: 0 }] })],
    });

    await save('g1', aGuideInput({ slug: 'new-guide' }));

    expect(await (dependencies.slugRedirects as InMemorySlugRedirectRepository).find('guide', 'old-guide')).toMatchObject({
      toSlug: 'new-guide',
    });
  });

  it('Given an unknown guide id, when opened or saved, then the response is 404', async () => {
    useSignedInOwner({ studios: studios() });

    expect((await getGuideForEdit(adminRequest('/api/admin/guides/x'), idParams('x'))).status).toBe(404);
    expect((await save('x', aGuideInput())).status).toBe(404);
  });

  it('Given no owner session, when a guide is created, then the response is 401 and nothing is stored', async () => {
    const dependencies = useSignedInOwner({ studios: studios() });

    expect((await create(aGuideInput(), false)).status).toBe(401);
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

  it.each([
    ['a blank search', '  '],
    ['a search over 100 characters', 'x'.repeat(101)],
  ])('Given %s, when the owner searches, then the response is 400 naming q (ICD E39)', async (_label, q) => {
    useSignedInOwner({ studios: studios() });

    const problem = await expectProblem(await search(q), 'validation-failed', 400);

    expect(problem.errors).toEqual([{ field: 'q', code: expect.any(String), message: expect.any(String) }]);
  });

  it('Given no owner session, when the picker searches, then the response is 401', async () => {
    useSignedInOwner({ studios: studios() });

    expect((await search('loft', false)).status).toBe(401);
  });
});
