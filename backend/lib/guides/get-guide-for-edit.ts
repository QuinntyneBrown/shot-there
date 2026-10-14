import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideEditorModel } from '@/lib/guides/guide-editor-model';
import { toGuideEditorModel } from '@/lib/guides/to-guide-editor-model';

/** One guide of any status for the owner's editor; null when no guide has the id. */
export async function getGuideForEdit(id: string): Promise<GuideEditorModel | null> {
  const guide = await getDependencies().guides.findById(id);
  return guide ? toGuideEditorModel(guide) : null;
}
