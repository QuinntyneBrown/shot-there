import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { getSpotForEdit } from '@/lib/spots/get-spot-for-edit';
import { parseSpotInput } from '@/lib/spots/parse-spot-input';
import { updateSpot } from '@/lib/spots/update-spot';

export const GET = withRequestLogging(async (request: Request, { params }: IdParams) => {
  await requireOwnerSession(request);
  const spot = await getSpotForEdit((await params).id);
  return spot ? Response.json(spot) : notFound();
});

export const PUT = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const spot = await updateSpot((await params).id, await parseSpotInput(request));
  return spot ? Response.json(spot) : notFound();
});
