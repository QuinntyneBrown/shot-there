import { POST } from '@/app/api/auth/sign-in/route';

/** Posts credentials to the sign-in endpoint from the given client address. */
export function signIn(body: unknown, clientIp = '198.51.100.7'): Promise<Response> {
  return POST(
    new Request('https://shotthere.ca/api/auth/sign-in', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': clientIp },
      body: JSON.stringify(body),
    }),
  );
}

/** The `name=value` pair of a cookie set by the response, or undefined. */
export function setCookie(response: Response, name: string): string | undefined {
  return response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${name}=`));
}
