import { notFound } from '@/lib/http/not-found';
import type { SlugParams } from '@/lib/http/slug-params';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { getSpot } from '@/lib/spots/get-spot';

export const GET = withRequestLogging(async (_request: Request, { params }: SlugParams) => {
  const spot = await getSpot((await params).slug);
  return spot ? Response.json(spot) : notFound();
});
