import { getDependencies } from '@/lib/data/dependency-container';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { readJsonBody } from '@/lib/http/read-json-body';
import { spotInputSchema } from '@/lib/spots/schemas';
import type { SpotInput } from '@/lib/spots/spot-input';

/** Reads and validates the spot save body, or throws a 400/413. */
export async function parseSpotInput(request: Request): Promise<SpotInput> {
  return parseWithSchema(spotInputSchema(getDependencies().clock.today()), await readJsonBody(request));
}
