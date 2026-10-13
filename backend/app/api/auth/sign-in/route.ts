import { signInSchema } from '@/lib/auth/schemas';
import { csrfCookie, sessionCookie } from '@/lib/auth/session-cookies';
import { signInOwner } from '@/lib/auth/sign-in-owner';
import { clientIp } from '@/lib/http/client-ip';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { readJsonBody } from '@/lib/http/read-json-body';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

const INVALID_CREDENTIALS = 'Email or password is incorrect';

export const POST = withRequestLogging(async (request: Request) => {
  const input = parseWithSchema(signInSchema, await readJsonBody(request));
  const result = await signInOwner(input, clientIp(request));

  if (result.outcome === 'invalidCredentials') {
    return Response.json({ status: 401, message: INVALID_CREDENTIALS }, { status: 401 });
  }
  const response = new Response(null, { status: 204 });
  response.headers.append('Set-Cookie', sessionCookie(result.session.token));
  response.headers.append('Set-Cookie', csrfCookie(result.session.csrfToken));
  return response;
});
