import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listMapLocations } from '@/lib/map/list-map-locations';

export const GET = withRequestLogging(async () => Response.json(await listMapLocations()));
