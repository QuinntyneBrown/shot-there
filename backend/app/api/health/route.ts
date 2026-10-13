import { checkHealth } from '@/lib/health/check-health';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const dynamic = 'force-dynamic';

export const GET = withRequestLogging(async () => {
  const health = await checkHealth();
  return Response.json(health, { status: health.status === 'ok' ? 200 : 503 });
});
