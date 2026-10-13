import { test as base } from '@playwright/test';

/** Every test starts with no backend: any /api request that a test has not faked is aborted. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/**', (route) => route.abort());
    await use(page);
  },
});

export { expect } from '@playwright/test';
