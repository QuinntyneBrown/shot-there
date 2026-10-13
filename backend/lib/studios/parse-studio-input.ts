import { getDependencies } from '@/lib/data/dependency-container';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { readJsonBody } from '@/lib/http/read-json-body';
import { studioInputSchema } from '@/lib/studios/schemas';
import type { StudioInput } from '@/lib/studios/studio-input';

/** Reads and validates the studio save body, or throws a 400/413. */
export async function parseStudioInput(request: Request): Promise<StudioInput> {
  return parseWithSchema(studioInputSchema(getDependencies().clock.today()), await readJsonBody(request));
}
