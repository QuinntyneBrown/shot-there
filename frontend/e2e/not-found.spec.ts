import { expect, test } from './fakes/test';
import { NotFoundPage } from './pages/not-found.page';

test.describe('Not-found page', () => {
  test('explains a missing page and offers a way back', async ({ page }) => {
    // Given a path that matches no page
    const notFound = new NotFoundPage(page);
    // When the visitor opens it
    await notFound.open('/no-such-page');
    // Then the not-found page explains it and links home and to the studio list
    await expect(notFound.heading).toHaveText("We couldn't find that page");
    await expect(notFound.homeLink).toHaveAttribute('href', '/');
    await expect(notFound.browseStudiosLink).toHaveAttribute('href', '/studios');
    // And the title carries the site suffix
    await expect.poll(() => notFound.title()).toBe('Page not found · ShotThere');
  });
});
