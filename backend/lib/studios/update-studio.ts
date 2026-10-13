import { getDependencies } from '@/lib/data/dependency-container';
import type { StudioInput } from '@/lib/studios/studio-input';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** Replaces the studio's editable fields, fees and gear. The price verified date changes only when the input carries one. Null when no studio has the id. */
export async function updateStudio(id: string, input: StudioInput): Promise<StudioRecord | null> {
  const { studios, clock } = getDependencies();
  const stored = await studios.findById(id);
  if (!stored) return null;

  const { priceVerifiedAt, ...fields } = input;
  const studio: StudioRecord = {
    ...stored,
    ...fields,
    priceVerifiedAt: priceVerifiedAt ?? stored.priceVerifiedAt,
    updatedAt: clock.now(),
  };
  await studios.save(studio);
  return studio;
}
