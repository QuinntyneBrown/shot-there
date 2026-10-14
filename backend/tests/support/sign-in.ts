import { POST } from '@/app/api/auth/sign-in/route';
import { SITE_ORIGIN } from '@/tests/support/owner-account';

/** Posts credentials to the sign-in endpoint from the given client address and, by default, the site's own origin. */
export function signIn(body: unknown, clientIp = '198.51.100.7', origin: string | null = SITE_ORIGIN): Promise<Response> {
  const headers: Record<string, string> = { 'content-type': 'application/json', 'x-forwarded-for': clientIp };
  if (origin !== null) headers.origin = origin;
  return POST(new Request('https://shotthere.ca/api/auth/sign-in', { method: 'POST', headers, body: JSON.stringify(body) }));
}

/** The `name=value` pair of a cookie set by the response, or undefined. */
export function setCookie(response: Response, name: string): string | undefined {
  return response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${name}=`));
}
