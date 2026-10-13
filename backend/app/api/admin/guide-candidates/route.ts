import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { searchGuideCandidates } from '@/lib/guides/search-guide-candidates';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await searchGuideCandidates(new URL(request.url).searchParams.get('q') ?? ''));
});
