import { Page, Route } from '@playwright/test';

import { FakeStudioSummary } from './studio-summaries';

const isStudioList = (url: URL) => url.pathname === '/api/studios';

/** The studio list endpoint answers with these studios. */
export async function givenStudios(page: Page, studios: FakeStudioSummary[]): Promise<void> {
  await page.route(isStudioList, (route: Route) => route.fulfill({ json: studios }));
}
