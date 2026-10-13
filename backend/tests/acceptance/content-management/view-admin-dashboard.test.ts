import { describe, expect, it } from 'vitest';
import { GET as getDashboard } from '@/app/api/admin/dashboard/route';
import { adminRequest, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';

stubSiteOriginPerTest();

const TODAY = '2026-10-13';

async function dashboard() {
  const response = await getDashboard(adminRequest('/api/admin/dashboard'));
  return { status: response.status, body: await response.json() };
}

describe('L2-053 administration dashboard counts', () => {
  it('Given three published and two draft studios, when the owner opens the dashboard, then the studio counts are 3 published and 2 draft', async () => {
    useSignedInOwner({
      today: TODAY,
      studios: [
        aStudio(),
        aStudio(),
        aStudio(),
        aStudio({ status: 'draft' }),
        aStudio({ status: 'draft' }),
      ],
      spots: [aSpot({ status: 'draft' })],
      guides: [aGuide()],
    });

    const { status, body } = await dashboard();

    expect(status).toBe(200);
    expect(body.counts).toEqual({
      studios: { published: 3, draft: 2 },
      spots: { published: 0, draft: 1 },
      guides: { published: 1, draft: 0 },
    });
  });
});

describe('L2-044 stale data list for the owner', () => {
  it('Given two studios with stale pricing and one spot with a stale permit, when the owner opens the dashboard, then all three are listed oldest first with field and date', async () => {
    useSignedInOwner({
      today: TODAY,
      studios: [
        aStudio({ id: 's1', name: 'Loft A', priceVerifiedAt: '2026-03-27' }),
        aStudio({ id: 's2', name: 'Loft B', status: 'draft', priceVerifiedAt: '2026-01-10' }),
        aStudio({ id: 's3', name: 'Fresh', priceVerifiedAt: '2026-10-01' }),
      ],
      spots: [aSpot({ id: 'p1', name: 'Riverdale Park', permitVerifiedAt: '2026-02-15' })],
    });

    const { body } = await dashboard();

    expect(body.verification).toEqual([
      { kind: 'studio', id: 's2', name: 'Loft B', field: 'price', lastVerifiedAt: '2026-01-10', ageDays: 276, group: 'stale' },
      { kind: 'spot', id: 'p1', name: 'Riverdale Park', field: 'permit', lastVerifiedAt: '2026-02-15', ageDays: 240, group: 'stale' },
      { kind: 'studio', id: 's1', name: 'Loft A', field: 'price', lastVerifiedAt: '2026-03-27', ageDays: 200, group: 'stale' },
    ]);
  });

  it('Given a location verified 170 days ago, when the owner opens the dashboard, then it appears in the due-soon group', async () => {
    useSignedInOwner({ today: TODAY, studios: [aStudio({ id: 's1', priceVerifiedAt: '2026-04-26' })] });

    const { body } = await dashboard();

    expect(body.verification).toEqual([expect.objectContaining({ id: 's1', ageDays: 170, group: 'dueSoon' })]);
  });

  it('Given verifications 183 and 153 days old, when the owner opens the dashboard, then both are due soon and one 152 days old is not listed', async () => {
    useSignedInOwner({
      today: TODAY,
      studios: [
        aStudio({ id: 'd183', priceVerifiedAt: '2026-04-13' }),
        aStudio({ id: 'd153', priceVerifiedAt: '2026-05-13' }),
        aStudio({ id: 'd152', priceVerifiedAt: '2026-05-14' }),
      ],
    });

    const { body } = await dashboard();

    expect(body.verification.map((item: { id: string; group: string }) => [item.id, item.group])).toEqual([
      ['d183', 'dueSoon'],
      ['d153', 'dueSoon'],
    ]);
  });

  it('Given no stale or due-soon data, when the owner opens the dashboard, then the verification list is empty', async () => {
    useSignedInOwner({ today: TODAY, studios: [aStudio({ priceVerifiedAt: '2026-10-01' })] });

    expect((await dashboard()).body.verification).toEqual([]);
  });

  it('Given no owner session, when the dashboard is requested, then the response is 401', async () => {
    useSignedInOwner();

    const response = await getDashboard(adminRequest('/api/admin/dashboard', { signedIn: false }));

    expect(response.status).toBe(401);
  });
});
