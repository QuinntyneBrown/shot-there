import { currentCorrelationId } from '@/lib/logging/correlation-context';
import { log } from '@/lib/logging/logger';
import type { PageRevalidator } from '@/lib/publishing/page-revalidator';

/**
 * Logs the routes a change affects. The hosting provider and its purge API are still to be chosen; until then public
 * lists converge through their 60-second cache lifetime.
 */
export const loggingPageRevalidator: PageRevalidator = {
  async revalidate(routes) {
    log('info', currentCorrelationId(), { event: 'pages.revalidate', routes });
  },
};
