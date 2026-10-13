import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { proxy } from '@/proxy';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INCOMING = '4b0c8a2e-3f1d-4e5a-9b6c-7d8e9f0a1b2c';

const healthWith = (correlationId: string) =>
  health(new Request('http://localhost/api/health', { headers: { 'x-correlation-id': correlationId } }));

describe('ICD §11 correlation IDs', () => {
  it('Given a request carrying a UUID correlation ID, when answered, then the response reuses it', async () => {
    useFakeDependencies();

    const response = await healthWith(INCOMING);

    expect(response.headers.get('x-correlation-id')).toBe(INCOMING);
  });

  it('Given a request carrying a correlation ID that is not a UUID, when answered, then the response carries a new UUID v4', async () => {
    useFakeDependencies();

    const response = await healthWith('render-42');

    const correlationId = response.headers.get('x-correlation-id') ?? '';
    expect(correlationId).not.toBe('render-42');
    expect(correlationId).toMatch(UUID);
  });

  it.each([
    ['a 401 for an admin path without a session', new NextRequest('https://shotthere.ca/api/admin/studios')],
    [
      'a 413 for an oversized JSON body',
      new NextRequest('https://shotthere.ca/api/subscribers', { method: 'POST', headers: { 'content-length': String(2 * 1024 * 1024) } }),
    ],
  ])('Given %s answered by the proxy, when inspected, then it carries a correlation ID', async (_label, request) => {
    const response = await proxy(request);

    expect(response.headers.get('x-correlation-id')).toMatch(UUID);
  });

  it('Given a 413 problem answered by the proxy, when inspected, then its body correlation ID equals the header', async () => {
    const response = await proxy(
      new NextRequest('https://shotthere.ca/api/subscribers', {
        method: 'POST',
        headers: { 'content-length': String(2 * 1024 * 1024), 'x-correlation-id': INCOMING },
      }),
    );

    expect(response.headers.get('x-correlation-id')).toBe(INCOMING);
    expect((await response.json()).correlationId).toBe(INCOMING);
  });
});
