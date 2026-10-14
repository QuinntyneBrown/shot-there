import { getDependencies } from '@/lib/data/dependency-container';
import type { SpotEditorModel } from '@/lib/spots/spot-editor-model';
import { toSpotEditorModel } from '@/lib/spots/to-spot-editor-model';

/** One spot of any status, with its permits and images, for the owner's editor. */
export async function getSpotForEdit(id: string): Promise<SpotEditorModel | null> {
  const spot = await getDependencies().spots.findById(id);
  return spot ? toSpotEditorModel(spot) : null;
}
