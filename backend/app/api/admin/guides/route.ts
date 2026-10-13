import { listAdminContent } from '@/lib/admin/list-admin-content';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { createGuide } from '@/lib/guides/create-guide';
import { parseGuideInput } from '@/lib/guides/parse-guide-input';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await listAdminContent('guides'));
});

export const POST = withRequestLogging(async (request: Request) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const guide = await createGuide(await parseGuideInput(request));
  return Response.json(guide, { status: 201 });
});
