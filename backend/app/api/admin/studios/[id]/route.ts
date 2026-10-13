import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { deleteLocation } from '@/lib/deletion/delete-location';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { getStudioForEdit } from '@/lib/studios/get-studio-for-edit';
import { parseStudioInput } from '@/lib/studios/parse-studio-input';
import { updateStudio } from '@/lib/studios/update-studio';

export const GET = withRequestLogging(async (request: Request, { params }: IdParams) => {
  await requireOwnerSession(request);
  const studio = await getStudioForEdit((await params).id);
  return studio ? Response.json(studio) : notFound();
});

export const PUT = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const studio = await updateStudio((await params).id, await parseStudioInput(request));
  return studio ? Response.json(studio) : notFound();
});

export const DELETE = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  return (await deleteLocation('studio', (await params).id)) ? new Response(null, { status: 204 }) : notFound();
});
