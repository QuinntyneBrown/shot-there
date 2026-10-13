import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import {
  DELETE as unpublishSpot,
  POST as publishSpot,
} from '@/app/api/admin/spots/[id]/publish/route';
import {
  DELETE as unpublishStudio,
  POST as publishStudio,
} from '@/app/api/admin/studios/[id]/publish/route';
import { GET as getPublicSpot } from '@/app/api/spots/[slug]/route';
import { GET as getPublicStudio } from '@/app/api/studios/[slug]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aGuide, aSpot, aStudio, anImage } from '@/tests/support/builders';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import type { RecordingPageRevalidator } from '@/tests/support/recording-page-revalidator';

stubSiteOriginPerTest();

const publish = (id: string, signedIn = true) =>
  publishStudio(adminRequest(`/api/admin/studios/${id}/publish`, { method: 'POST', signedIn }), idParams(id));
const unpublish = (id: string) =>
  unpublishStudio(adminRequest(`/api/admin/studios/${id}/publish`, { method: 'DELETE' }), idParams(id));
const publicStudioStatus = async (slug: string) =>
  (await getPublicStudio(new Request(`http://localhost/api/studios/${slug}`), { params: Promise.resolve({ slug }) })).status;

function revalidatedRoutes(dependencies: ReturnType<typeof useSignedInOwner>) {
  return (dependencies.pageRevalidator as RecordingPageRevalidator).routes;
}

describe('L2-056 and L2-002 publish a studio', () => {
  it('Given a complete draft studio, when the owner publishes it, then it is published and its public page returns 200 on the next request', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'loft', status: 'draft', publishedAt: null })] });
    expect(await publicStudioStatus('loft')).toBe(404);

    const response = await publish('s1');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 's1', status: 'published' });
    expect((dependencies.studios as InMemoryStudioRepository).rows[0].publishedAt).toEqual(dependencies.clock.now());
    expect(await publicStudioStatus('loft')).toBe(200);
  });

  it('Given a draft studio missing its ceiling height, when the owner publishes it, then publishing is refused with 422 listing ceilingHeight', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', status: 'draft', ceilingHeightM: null })] });

    const response = await publish('s1');

    const problem = await expectProblem(response, 'publish-incomplete', 422);
    expect(problem.missingFields).toEqual(['ceilingHeight']);
    expect((dependencies.studios as InMemoryStudioRepository).rows[0].status).toBe('draft');
    expect(revalidatedRoutes(dependencies)).toEqual([]);
  });

  it('Given a draft studio with only basics, when the owner publishes it, then every missing standard field is listed', async () => {
    useSignedInOwner({
      studios: [
        aStudio({
          id: 's1',
          status: 'draft',
          bookingUrl: null,
          usableDepthM: null,
          lightEvening: null,
          outletType: null,
          hasCycWall: null,
          scoreGear: null,
          whoShouldSkip: null,
          disclosure: null,
          images: [],
        }),
      ],
    });

    const response = await publish('s1');

    expect((await response.json()).missingFields).toEqual([
      'bookingUrl',
      'usableSpace',
      'naturalLight',
      'power',
      'cycWall',
      'testShots',
      'gallery',
      'scores',
      'verdict',
      'disclosure',
    ]);
  });

  it('Given a comped studio without a provider, when the owner publishes it, then publishing is refused naming disclosureProvider', async () => {
    useSignedInOwner({ studios: [aStudio({ id: 's1', status: 'draft', disclosure: 'comped', disclosureProvider: null })] });

    const response = await publish('s1');

    expect(response.status).toBe(422);
    expect((await response.json()).missingFields).toEqual(['disclosureProvider']);
  });

  it('Given a draft studio that has no review date, when it is published, then the review date becomes today', async () => {
    const dependencies = useSignedInOwner({ today: '2026-10-13', studios: [aStudio({ id: 's1', status: 'draft', reviewedAt: null })] });

    await publish('s1');

    expect((dependencies.studios as InMemoryStudioRepository).rows[0].reviewedAt).toBe('2026-10-13');
  });

  it('Given a studio featured in a published guide, when it is published, then its page, list, map, comparison, sitemap and that guide are revalidated', async () => {
    const dependencies = useSignedInOwner({
      studios: [aStudio({ id: 's1', slug: 'loft', status: 'draft' })],
      guides: [
        aGuide({ slug: 'best-light', entries: [{ kind: 'studio', locationId: 's1', note: '', position: 0 }] }),
        aGuide({ slug: 'unrelated' }),
      ],
    });

    await publish('s1');

    expect(revalidatedRoutes(dependencies)).toEqual([
      ['/studios/loft', '/studios', '/map', '/compare', '/sitemap.xml', '/guides/best-light'],
    ]);
  });

  it('Given an unknown studio id, when the owner publishes it, then the response is 404', async () => {
    useSignedInOwner();

    expect((await publish('nope')).status).toBe(404);
  });

  it('Given no owner session, when a studio is published, then the response is 401 and it stays a draft', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', status: 'draft' })] });

    expect((await publish('s1', false)).status).toBe(401);
    expect((dependencies.studios as InMemoryStudioRepository).rows[0].status).toBe('draft');
  });
});

describe('L2-056 unpublish a studio', () => {
  it('Given a published studio, when the owner unpublishes it, then it becomes a draft and its public page returns 404 on the next request', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'loft' })] });

    const response = await unpublish('s1');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: 'draft' });
    expect(await publicStudioStatus('loft')).toBe(404);
    expect(revalidatedRoutes(dependencies)[0]).toContain('/studios/loft');
  });
});

describe('L2-056, L2-002 and L2-045 publish an outdoor spot', () => {
  const publishSpotRequest = (id: string) =>
    publishSpot(adminRequest(`/api/admin/spots/${id}/publish`, { method: 'POST' }), idParams(id));
  const publicSpotStatus = async (slug: string) =>
    (await getPublicSpot(new Request(`http://localhost/api/spots/${slug}`), { params: Promise.resolve({ slug }) })).status;

  it('Given a complete draft spot, when the owner publishes it, then its public page returns 200 and spot routes are revalidated', async () => {
    const dependencies = useSignedInOwner({ spots: [aSpot({ id: 'p1', slug: 'park', status: 'draft' })] });

    const response = await publishSpotRequest('p1');

    expect(response.status).toBe(200);
    expect(await publicSpotStatus('park')).toBe(200);
    expect(revalidatedRoutes(dependencies)).toEqual([['/spots/park', '/spots', '/map', '/sitemap.xml']]);
  });

  it('Given a draft spot missing its permit source link, when the owner publishes it, then publishing is refused listing permitSourceUrl', async () => {
    useSignedInOwner({ spots: [aSpot({ id: 'p1', status: 'draft', permitSourceUrl: null })] });

    const response = await publishSpotRequest('p1');

    expect(response.status).toBe(422);
    expect((await response.json()).missingFields).toEqual(['permitSourceUrl']);
  });

  it('Given a draft spot with no best uses, no disclosure and no sample shot, when published, then each is listed', async () => {
    useSignedInOwner({
      spots: [
        aSpot({
          id: 'p1',
          status: 'draft',
          latitude: null,
          lightBySeason: [],
          permits: [],
          bestUses: [],
          disclosure: null,
          images: [anImage({ role: 'gallery' })],
        }),
      ],
    });

    const response = await publishSpotRequest('p1');

    expect((await response.json()).missingFields).toEqual([
      'coordinates',
      'lightBySeason',
      'sampleShots',
      'permitStatus',
      'bestUses',
      'disclosure',
    ]);
  });

  it('Given a published spot, when the owner unpublishes it, then its page returns 404', async () => {
    useSignedInOwner({ spots: [aSpot({ id: 'p1', slug: 'park' })] });

    const response = await unpublishSpot(adminRequest('/api/admin/spots/p1/publish', { method: 'DELETE' }), idParams('p1'));

    expect(response.status).toBe(200);
    expect(await publicSpotStatus('park')).toBe(404);
  });
});
