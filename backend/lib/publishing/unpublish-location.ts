import { getDependencies } from '@/lib/data/dependency-container';
import type { LocationKind } from '@/lib/publishing/location-kind';
import { revalidatePublicPages } from '@/lib/publishing/revalidate-public-pages';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** Returns the location to draft so the public site stops showing it. Null when no location of the kind has the id. */
export async function unpublishLocation(kind: LocationKind, id: string): Promise<StudioRecord | SpotRecord | null> {
  const { studios, spots, clock } = getDependencies();

  if (kind === 'studio') {
    const studio = await studios.findById(id);
    if (!studio) return null;
    const draft: StudioRecord = { ...studio, status: 'draft', publishedAt: null, updatedAt: clock.now() };
    await studios.save(draft);
    await revalidatePublicPages(kind, draft);
    return draft;
  }

  const spot = await spots.findById(id);
  if (!spot) return null;
  const draft: SpotRecord = { ...spot, status: 'draft', publishedAt: null, updatedAt: clock.now() };
  await spots.save(draft);
  await revalidatePublicPages(kind, draft);
  return draft;
}
