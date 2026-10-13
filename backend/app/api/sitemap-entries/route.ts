import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { listSitemapEntries } from '@/lib/seo/list-sitemap-entries';

export const GET = withRequestLogging(async () => Response.json(await listSitemapEntries()));
