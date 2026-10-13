import { Page, Route } from '@playwright/test';

import { FakeStudioSummary } from './studio-summaries';

const isStudioList = (url: URL) => url.pathname === '/api/studios';

/** The studio list endpoint answers with these studios. */
export async function givenStudios(page: Page, studios: FakeStudioSummary[]): Promise<void> {
  await page.route(isStudioList, (route: Route) => route.fulfill({ json: studios }));
}

/** The studio list endpoint fails with a server error. */
export async function givenStudioListFails(page: Page): Promise<void> {
  await page.route(isStudioList, (route: Route) => route.fulfill({ status: 500, json: { error: 'internal' } }));
}

/** The studio list endpoint holds its answer until the returned function is called. */
export async function givenStudioListPending(page: Page, studios: FakeStudioSummary[]): Promise<() => void> {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(isStudioList, async (route: Route) => {
    await released;
    await route.fulfill({ json: studios });
  });
  return release;
}
