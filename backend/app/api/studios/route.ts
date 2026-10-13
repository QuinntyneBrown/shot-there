import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listStudios } from '@/lib/studios/list-studios';
import { parseStudioListQuery } from '@/lib/studios/schemas';

export const GET = withRequestLogging(async (request: Request) =>
  Response.json(await listStudios(parseStudioListQuery(new URL(request.url).searchParams))),
);
