import type { GuideInput } from '@/lib/guides/guide-input';
import { guideInputSchema } from '@/lib/guides/schemas';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { readJsonBody } from '@/lib/http/read-json-body';

/** Reads and validates the guide save body, or throws a 400/413. */
export async function parseGuideInput(request: Request): Promise<GuideInput> {
  return parseWithSchema(guideInputSchema, await readJsonBody(request));
}
