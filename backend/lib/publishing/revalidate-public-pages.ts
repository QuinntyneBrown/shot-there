import { getDependencies } from '@/lib/data/dependency-container';
import { affectedRoutes } from '@/lib/publishing/affected-routes';
import type { LocationKind } from '@/lib/publishing/location-kind';

/** Asks for every public route affected by a change to the location to be regenerated. */
export async function revalidatePublicPages(kind: LocationKind, location: { id: string; slug: string }): Promise<void> {
  const { guides, pageRevalidator } = getDependencies();
  const featuringGuides = (await guides.listPublished()).filter((guide) =>
    guide.entries.some((entry) => entry.kind === kind && entry.locationId === location.id),
  );
  await pageRevalidator.revalidate(affectedRoutes(kind, location.slug, featuringGuides.map((guide) => guide.slug)));
}
