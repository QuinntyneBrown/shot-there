import { describe, expect, it } from 'vitest';
import { GET as listAdminGuides } from '@/app/api/admin/guides/route';
import { GET as listAdminSpots } from '@/app/api/admin/spots/route';
import { GET as listAdminStudios } from '@/app/api/admin/studios/route';
import { adminRequest, useSignedInOwner, stubSiteOriginPerTest } from '@/tests/support/admin-session';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';

stubSiteOriginPerTest();

const at = (day: string) => new Date(`${day}T12:00:00Z`);

describe('L2-063 administration list screens', () => {
  it('Given five studios, draft and published, when the owner opens the studio list, then all five are listed with status and last-updated date, newest first', async () => {
    useSignedInOwner({
      studios: [
        aStudio({ id: 's1', name: 'One', updatedAt: at('2026-10-01') }),
        aStudio({ id: 's2', name: 'Two', status: 'draft', updatedAt: at('2026-10-05') }),
        aStudio({ id: 's3', name: 'Three', updatedAt: at('2026-09-01') }),
        aStudio({ id: 's4', name: 'Four', status: 'draft', updatedAt: at('2026-10-10') }),
        aStudio({ id: 's5', name: 'Five', updatedAt: at('2026-08-01') }),
      ],
    });

    const response = await listAdminStudios(adminRequest('/api/admin/studios'));

    expect(response.status).toBe(200);
    const rows = await response.json();
    expect(rows.map((row: { id: string }) => row.id)).toEqual(['s4', 's2', 's1', 's3', 's5']);
    expect(rows[0]).toEqual({
      id: 's4',
      name: 'Four',
      neighbourhood: 'Leslieville',
      status: 'draft',
      updatedAt: '2026-10-10T12:00:00.000Z',
      stale: false,
    });
  });

  it('Given a studio whose price was verified 200 days ago, when listed, then its row is flagged stale', async () => {
    useSignedInOwner({ today: '2026-10-13', studios: [aStudio({ id: 's1', priceVerifiedAt: '2026-03-27' })] });

    const rows = await (await listAdminStudios(adminRequest('/api/admin/studios'))).json();

    expect(rows[0].stale).toBe(true);
  });

  it('Given spots with fresh and stale permits, when the owner opens the spot list, then each row carries its permit stale flag', async () => {
    useSignedInOwner({
      today: '2026-10-13',
      spots: [
        aSpot({ id: 'p1', status: 'draft', permitVerifiedAt: '2026-03-27', updatedAt: at('2026-10-02') }),
        aSpot({ id: 'p2', permitVerifiedAt: '2026-10-01', updatedAt: at('2026-10-01') }),
      ],
    });

    const rows = await (await listAdminSpots(adminRequest('/api/admin/spots'))).json();

    expect(rows.map((row: { id: string; stale: boolean; status: string }) => [row.id, row.status, row.stale])).toEqual([
      ['p1', 'draft', true],
      ['p2', 'published', false],
    ]);
  });

  it('Given guides, when the owner opens the guide list, then each row has the title as name and no neighbourhood', async () => {
    useSignedInOwner({ guides: [aGuide({ id: 'g1', title: 'Best under $100', status: 'draft' })] });

    const rows = await (await listAdminGuides(adminRequest('/api/admin/guides'))).json();

    expect(rows).toEqual([
      { id: 'g1', name: 'Best under $100', neighbourhood: null, status: 'draft', updatedAt: expect.any(String), stale: false },
    ]);
  });

  it.each([
    ['studios', listAdminStudios],
    ['spots', listAdminSpots],
    ['guides', listAdminGuides],
  ])('Given no owner session, when the %s admin list is requested, then the response is 401 with no body', async (kind, handler) => {
    useSignedInOwner();

    const response = await handler(adminRequest(`/api/admin/${kind}`, { signedIn: false }));

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('');
  });
});
