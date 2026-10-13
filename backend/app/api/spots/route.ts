import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listSpots } from '@/lib/spots/list-spots';
import { parseSpotListQuery } from '@/lib/spots/schemas';

export const GET = withRequestLogging(async (request: Request) =>
  Response.json(await listSpots(parseSpotListQuery(new URL(request.url).searchParams))),
);
