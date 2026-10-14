import { Page, Route } from '@playwright/test';

import { FakeComparison } from './comparisons';

/** The comparison endpoint answers with this comparison. Returns the `studios` value of every request it receives. */
export async function givenComparison(
  page: Page,
  comparison: FakeComparison,
): Promise<(string | null)[]> {
  const requested: (string | null)[] = [];
  await page.route(
    (url) => url.pathname === '/api/compare',
    (route: Route) => {
      requested.push(new URL(route.request().url()).searchParams.get('studios'));
      return route.fulfill({ json: comparison });
    },
  );
  return requested;
}
