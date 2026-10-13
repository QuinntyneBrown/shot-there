import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listPublicRoutes } from '@/lib/publishing/list-public-routes';

export const GET = withRequestLogging(async () => Response.json(await listPublicRoutes()));
