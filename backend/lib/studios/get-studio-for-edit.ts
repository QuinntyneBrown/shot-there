import { getDependencies } from '@/lib/data/dependency-container';
import type { StudioEditorModel } from '@/lib/studios/studio-editor-model';
import { toStudioEditorModel } from '@/lib/studios/to-studio-editor-model';

/** One studio of any status, with its fees, gear and images, for the owner's editor. */
export async function getStudioForEdit(id: string): Promise<StudioEditorModel | null> {
  const studio = await getDependencies().studios.findById(id);
  return studio ? toStudioEditorModel(studio) : null;
}
