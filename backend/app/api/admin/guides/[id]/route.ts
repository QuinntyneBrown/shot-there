import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { getGuideForEdit } from '@/lib/guides/get-guide-for-edit';
import { parseGuideInput } from '@/lib/guides/parse-guide-input';
import { updateGuide } from '@/lib/guides/update-guide';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request, { params }: IdParams) => {
  await requireOwnerSession(request);
  const guide = await getGuideForEdit((await params).id);
  return guide ? Response.json(guide) : notFound();
});

export const PUT = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const guide = await updateGuide((await params).id, await parseGuideInput(request));
  return guide ? Response.json(guide) : notFound();
});
