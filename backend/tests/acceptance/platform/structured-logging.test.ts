import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/health/route';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { captureLogs } from '@/tests/support/captured-logs';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

describe('L2-085 structured logging', () => {
  it('Given any request, when it completes, then one JSON line has method, path, status, duration and the correlation ID returned in a header', async () => {
    useFakeDependencies();
    const logs = captureLogs();

    const response = await GET(new Request('http://localhost/api/health'));

    const correlationId = response.headers.get('x-correlation-id');
    expect(correlationId).toBeTruthy();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      level: 'info',
      method: 'GET',
      path: '/api/health',
      status: 200,
      correlationId,
    });
    expect(typeof logs[0].durationMs).toBe('number');
  });

  it('Given an unhandled error, when logged, then the line has the correlation ID, error name and stack at level error, and the response is a 500 without internal detail', async () => {
    const logs = captureLogs();
    const handler = withRequestLogging(async () => {
      throw new TypeError('secret internal detail');
    });

    const response = await handler(new Request("http://localhost/api/anything"));

    expect(response.status).toBe(500);
    const body = await response.text();
    expect(body).not.toContain('secret internal detail');
    expect(body).not.toContain('TypeError');
    const errorLine = logs.find((line) => line.level === 'error');
    expect(errorLine).toMatchObject({
      correlationId: response.headers.get('x-correlation-id'),
      errorName: 'TypeError',
    });
    expect(String(errorLine?.stack)).toContain('secret internal detail');
  });
});
