import { listAdminContent } from '@/lib/admin/list-admin-content';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await listAdminContent('studios'));
});
