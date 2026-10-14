import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { deleteGuide } from '@/lib/deletion/delete-guide';
import { getGuideForEdit } from '@/lib/guides/get-guide-for-edit';
import { parseGuideInput } from '@/lib/guides/parse-guide-input';
import { toGuideEditorModel } from '@/lib/guides/to-guide-editor-model';
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
  return guide ? Response.json(await toGuideEditorModel(guide)) : notFound();
});

export const DELETE = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  return (await deleteGuide((await params).id)) ? new Response(null, { status: 204 }) : notFound();
});
