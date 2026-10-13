import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { proxy } from '@/proxy';

afterEach(() => vi.unstubAllEnvs());

describe('L2-080 security headers and transport', () => {
  it('Given any API response, when inspected, then it carries the CSP, nosniff, referrer policy and one-year HSTS headers', async () => {
    const response = await proxy(new NextRequest('https://shotthere.ca/api/studios'));

    const csp = response.headers.get('content-security-policy') ?? '';
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain('frame-src https://www.youtube-nocookie.com');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('strict-transport-security') ?? '')?.[1]);
    expect(maxAge).toBeGreaterThanOrEqual(31536000);
  });

  it('Given a request over plain HTTP in production, when received, then the server responds 301 to the HTTPS URL', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await proxy(
      new NextRequest('http://shotthere.ca/api/studios?sort=cost', { headers: { 'x-forwarded-proto': 'http' } }),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://shotthere.ca/api/studios?sort=cost');
  });
});

describe('L2-078 oversized payloads', () => {
  it('Given a JSON body larger than 1 MB on a non-upload endpoint, when received, then the server responds 413', async () => {
    const response = await proxy(
      new NextRequest('https://shotthere.ca/api/subscribers', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'content-length': String(1024 * 1024 + 1) },
      }),
    );

    expect(response.status).toBe(413);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('Given a large body on the image upload endpoint, when received, then the proxy lets it through', async () => {
    const response = await proxy(
      new NextRequest('https://shotthere.ca/api/admin/images', {
        method: 'POST',
        headers: { 'content-length': String(5 * 1024 * 1024) },
      }),
    );

    expect(response.status).not.toBe(413);
  });
});
