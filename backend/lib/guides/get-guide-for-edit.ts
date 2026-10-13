import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideEditorModel } from '@/lib/guides/guide-editor-model';

/** One guide of any status with entries in order and each location's name; null when no guide has the id. */
export async function getGuideForEdit(id: string): Promise<GuideEditorModel | null> {
  const { guides, studios, spots } = getDependencies();
  const guide = await guides.findById(id);
  if (!guide) return null;

  const entries = await Promise.all(
    [...guide.entries]
      .sort((a, b) => a.position - b.position)
      .map(async (entry) => {
        const location =
          entry.kind === 'studio' ? await studios.findById(entry.locationId) : await spots.findById(entry.locationId);
        return { ...entry, name: location?.name ?? '' };
      }),
  );
  return { ...guide, entries };
}
