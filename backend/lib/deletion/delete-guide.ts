import { getDependencies } from '@/lib/data/dependency-container';
import { refuseIfPublished } from '@/lib/deletion/refuse-if-published';

/** Deletes a draft guide and its entries. Refuses a published guide with 409. False when no guide has the id. */
export async function deleteGuide(id: string): Promise<boolean> {
  const { guides } = getDependencies();
  const guide = await guides.findById(id);
  if (!guide) return false;
  refuseIfPublished(guide.status);

  await guides.delete(id);
  return true;
}
