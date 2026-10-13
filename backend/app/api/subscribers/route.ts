import { clientIp } from '@/lib/http/client-ip';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { rateLimited } from '@/lib/http/rate-limited';
import { readJsonBody } from '@/lib/http/read-json-body';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { SIGNUP_WINDOW_SECONDS, checkRateLimit } from '@/lib/subscribers/check-rate-limit';
import { subscribeSchema } from '@/lib/subscribers/schemas';
import { subscribe } from '@/lib/subscribers/subscribe';

export const POST = withRequestLogging(async (request: Request) => {
  if (!checkRateLimit(clientIp(request))) throw rateLimited(SIGNUP_WINDOW_SECONDS);
  await subscribe(parseWithSchema(subscribeSchema, await readJsonBody(request)));
  return Response.json({ status: 'subscribed' });
});
