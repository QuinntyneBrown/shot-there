import { test as base } from '@playwright/test';

const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="#ccc"/></svg>';

/**
 * Every test starts with no backend: any /api request that a test has not faked is aborted,
 * fixture images under /test-images/ load as a plain placeholder, and the YouTube player never reaches the network.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/**', (route) => route.abort());
    await page.route('**/test-images/**', (route) =>
      route.fulfill({ contentType: 'image/svg+xml', body: PLACEHOLDER_SVG }),
    );
    await page.route('https://www.youtube-nocookie.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>player</title>' }),
    );
    await use(page);
  },
});

export { expect } from '@playwright/test';
