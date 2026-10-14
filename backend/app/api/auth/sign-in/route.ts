import { SIGN_IN_WINDOW_SECONDS } from '@/lib/auth/check-sign-in-rate-limit';
import { signInSchema } from '@/lib/auth/schemas';
import { csrfCookie, sessionCookie } from '@/lib/auth/session-cookies';
import { signInOwner } from '@/lib/auth/sign-in-owner';
import { verifyOrigin } from '@/lib/auth/verify-origin';
import { clientIp } from '@/lib/http/client-ip';
import { HttpProblem } from '@/lib/http/http-problem';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { rateLimited } from '@/lib/http/rate-limited';
import { readJsonBody } from '@/lib/http/read-json-body';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const POST = withRequestLogging(async (request: Request) => {
  verifyOrigin(request);
  const input = parseWithSchema(signInSchema, await readJsonBody(request));
  const result = await signInOwner(input, clientIp(request));

  if (result.outcome === 'rateLimited') throw rateLimited(SIGN_IN_WINDOW_SECONDS);
  if (result.outcome === 'invalidCredentials') throw new HttpProblem(401, null);
  const response = new Response(null, { status: 204 });
  response.headers.append('Set-Cookie', sessionCookie(result.session.token));
  response.headers.append('Set-Cookie', csrfCookie(result.session.csrfToken));
  return response;
});
