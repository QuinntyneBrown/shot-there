import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { removeImage } from '@/lib/images/remove-image';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const DELETE = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  return (await removeImage((await params).id)) ? new Response(null, { status: 204 }) : notFound();
});
