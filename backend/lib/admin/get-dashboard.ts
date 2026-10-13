import type { AdminDashboard } from '@/lib/admin/admin-dashboard';
import type { StatusCounts } from '@/lib/admin/status-counts';
import type { VerificationItem } from '@/lib/admin/verification-item';
import { getDependencies } from '@/lib/data/dependency-container';
import { verificationGroup } from '@/lib/freshness/verification-age';
import type { LocationStatus } from '@/lib/publishing/location-status';
import { daysBetween } from '@/lib/shared/is-stale';

/** Content counts by status and the re-verification list for the owner's dashboard. */
export async function getDashboard(): Promise<AdminDashboard> {
  const { studios, spots, guides, clock } = getDependencies();
  const today = clock.today();
  const [allStudios, allSpots, allGuides] = await Promise.all([studios.listAll(), spots.listAll(), guides.listAll()]);

  const candidates = [
    ...allStudios.map((studio) => ({ kind: 'studio', id: studio.id, name: studio.name, field: 'price', lastVerifiedAt: studio.priceVerifiedAt }) as const),
    ...allSpots.map((spot) => ({ kind: 'spot', id: spot.id, name: spot.name, field: 'permit', lastVerifiedAt: spot.permitVerifiedAt }) as const),
  ];
  const verification: VerificationItem[] = [];
  for (const candidate of candidates) {
    const group = verificationGroup(candidate.lastVerifiedAt, today);
    if (group !== 'current') {
      verification.push({ ...candidate, ageDays: daysBetween(candidate.lastVerifiedAt, today), group });
    }
  }

  return {
    counts: { studios: countByStatus(allStudios), spots: countByStatus(allSpots), guides: countByStatus(allGuides) },
    verification: verification.sort((a, b) => b.ageDays - a.ageDays),
  };
}

function countByStatus(items: { status: LocationStatus }[]): StatusCounts {
  const published = items.filter((item) => item.status === 'published').length;
  return { published, draft: items.length - published };
}
