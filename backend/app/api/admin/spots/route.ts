import { listAdminContent } from '@/lib/admin/list-admin-content';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { createSpot } from '@/lib/spots/create-spot';
import { parseSpotInput } from '@/lib/spots/parse-spot-input';
import { toSpotEditorModel } from '@/lib/spots/to-spot-editor-model';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await listAdminContent('spots'));
});

export const POST = withRequestLogging(async (request: Request) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const spot = await createSpot(await parseSpotInput(request));
  return Response.json(toSpotEditorModel(spot), { status: 201, headers: { location: `/api/admin/spots/${spot.id}` } });
});
