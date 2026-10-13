import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { publishGuide, unpublishGuide } from '@/lib/guides/publish-guide';
import type { IdParams } from '@/lib/http/id-params';
import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { toPublicationStatusDto } from '@/lib/publishing/to-publication-status-dto';

export const POST = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const guide = await publishGuide((await params).id);
  return guide ? Response.json(toPublicationStatusDto(guide)) : notFound();
});

export const DELETE = withRequestLogging(async (request: Request, { params }: IdParams) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const guide = await unpublishGuide((await params).id);
  return guide ? Response.json(toPublicationStatusDto(guide)) : notFound();
});
