import { checkHealth } from '@/lib/health/check-health';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request): Promise<Response> {
  const health = await checkHealth();
  return Response.json(health, { status: health.status === 'ok' ? 200 : 503 });
}
