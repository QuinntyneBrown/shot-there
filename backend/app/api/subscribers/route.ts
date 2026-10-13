import { clientIp } from '@/lib/http/client-ip';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { readJsonBody } from '@/lib/http/read-json-body';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { checkRateLimit } from '@/lib/subscribers/check-rate-limit';
import { subscribeSchema } from '@/lib/subscribers/schemas';
import { subscribe } from '@/lib/subscribers/subscribe';

export const POST = withRequestLogging(async (request: Request) => {
  if (!checkRateLimit(clientIp(request))) return Response.json({ status: 429 }, { status: 429 });
  await subscribe(parseWithSchema(subscribeSchema, await readJsonBody(request)));
  return Response.json({ status: 'subscribed' });
});
