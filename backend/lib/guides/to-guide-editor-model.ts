import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideEditorModel } from '@/lib/guides/guide-editor-model';
import type { GuideRecord } from '@/lib/guides/guide-record';

/** The guide with entries in order, each with its location's current name and status. */
export async function toGuideEditorModel(guide: GuideRecord): Promise<GuideEditorModel> {
  const { studios, spots } = getDependencies();
  const entries = await Promise.all(
    [...guide.entries]
      .sort((a, b) => a.position - b.position)
      .map(async ({ kind, locationId, note }) => {
        const location = kind === 'studio' ? await studios.findById(locationId) : await spots.findById(locationId);
        return { kind, locationId, name: location?.name ?? '', status: location?.status ?? 'draft', note };
      }),
  );
  const { id, slug, status, title, summary, introduction, dataPoints } = guide;
  return {
    id,
    slug,
    status,
    publishedAt: guide.publishedAt?.toISOString() ?? null,
    updatedAt: guide.updatedAt.toISOString(),
    title,
    summary,
    introduction,
    dataPoints,
    entries,
  };
}
