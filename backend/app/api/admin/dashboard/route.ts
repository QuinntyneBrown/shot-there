import { getDashboard } from '@/lib/admin/get-dashboard';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await getDashboard());
});
