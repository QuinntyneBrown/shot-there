import type { AdminContentKind } from '@/lib/admin/admin-content-kind';
import type { AdminContentRow } from '@/lib/admin/admin-content-row';
import { getDependencies } from '@/lib/data/dependency-container';
import { isStale } from '@/lib/shared/is-stale';

/** Every item of the kind, draft and published, most recently updated first. */
export async function listAdminContent(kind: AdminContentKind): Promise<AdminContentRow[]> {
  const { studios, spots, guides, clock } = getDependencies();
  const today = clock.today();

  const rows: (AdminContentRow & { updated: Date })[] =
    kind === 'studios'
      ? (await studios.listAll()).map((studio) => ({
          ...row(studio.id, studio.name, studio.neighbourhood, studio.status, studio.updatedAt),
          stale: isStale(studio.priceVerifiedAt, today),
        }))
      : kind === 'spots'
        ? (await spots.listAll()).map((spot) => ({
            ...row(spot.id, spot.name, spot.neighbourhood, spot.status, spot.updatedAt),
            stale: isStale(spot.permitVerifiedAt, today),
          }))
        : (await guides.listAll()).map((guide) => row(guide.id, guide.title, null, guide.status, guide.updatedAt));

  return rows
    .sort((a, b) => b.updated.getTime() - a.updated.getTime())
    .map(({ updated: _updated, ...adminRow }) => adminRow);
}

function row(id: string, name: string, neighbourhood: string | null, status: AdminContentRow['status'], updated: Date) {
  return { id, name, neighbourhood, status, updatedAt: updated.toISOString(), stale: false, updated };
}
