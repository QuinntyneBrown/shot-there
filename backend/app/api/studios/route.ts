import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listStudios } from '@/lib/studios/list-studios';

export const GET = withRequestLogging(async () => Response.json(await listStudios()));
