import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { guideCandidateQuerySchema } from '@/lib/guides/guide-candidate-query-schema';
import { searchGuideCandidates } from '@/lib/guides/search-guide-candidates';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  const { q } = parseWithSchema(guideCandidateQuerySchema, { q: new URL(request.url).searchParams.get('q') ?? undefined });
  return Response.json(await searchGuideCandidates(q));
});
