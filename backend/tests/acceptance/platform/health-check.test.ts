import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/health/route';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

const healthRequest = () => new Request('http://localhost/api/health');

describe('L2-084 health check', () => {
  it('Given the data store is reachable, when /api/health is requested, then it returns 200 {"status":"ok"}', async () => {
    useFakeDependencies({ probeDatabase: async () => {} });

    const response = await GET(healthRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('Given the data store is unreachable, when /api/health is requested, then it returns 503 {"status":"degraded"} with no connection details', async () => {
    useFakeDependencies({
      probeDatabase: async () => {
        throw new Error('connect ECONNREFUSED postgresql://user:secret@db:5432');
      },
    });

    const response = await GET(healthRequest());

    expect(response.status).toBe(503);
    expect(await response.text()).toBe('{"status":"degraded"}');
  });

  it('Given the data store hangs, when /api/health is requested, then it responds degraded within 500 ms', async () => {
    useFakeDependencies({ probeDatabase: () => new Promise<void>(() => {}) });

    const started = performance.now();
    const response = await GET(healthRequest());

    expect(performance.now() - started).toBeLessThan(500);
    expect(response.status).toBe(503);
  });
});
