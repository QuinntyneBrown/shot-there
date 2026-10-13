import { listGuides } from '@/lib/guides/list-guides';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async () => Response.json(await listGuides()));
