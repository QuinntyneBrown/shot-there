import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { toPublicationStatusDto } from '@/lib/publishing/to-publication-status-dto';
import { publishLocation } from '@/lib/publishing/publish-location';
import { unpublishLocation } from '@/lib/publishing/unpublish-location';

export const POST = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const location = await publishLocation('spot', (await params).id);
  return location ? Response.json(toPublicationStatusDto(location)) : notFound();
});

export const DELETE = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const location = await unpublishLocation('spot', (await params).id);
  return location ? Response.json(toPublicationStatusDto(location)) : notFound();
});
