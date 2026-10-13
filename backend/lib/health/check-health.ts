import { getDependencies } from '@/lib/data/dependency-container';
import type { HealthStatus } from '@/lib/health/health-status';

const PROBE_TIMEOUT_MS = 300;

export async function checkHealth(): Promise<HealthStatus> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Health probe timed out')), PROBE_TIMEOUT_MS);
  });
  try {
    await Promise.race([getDependencies().probeDatabase(), timeout]);
    return { status: 'ok' };
  } catch {
    return { status: 'degraded' };
  } finally {
    clearTimeout(timer);
  }
}
