import { givenStudioListFails, givenStudios } from './fakes/fake-studios-api';
import { givenSubscribeAnswers } from './fakes/fake-subscribers-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { HomePage } from './pages/home.page';
import { ShellPage } from './pages/shell.page';

test.describe('Home page', () => {
  test('states the promise, offers the signup and shows the three latest reviews', async ({
    page,
  }) => {
    // Given seven published studios, newest review first
    await givenStudios(page, PUBLISHED_STUDIOS);
    const home = new HomePage(page);
    // When the visitor opens the home page
    await home.open();
    // Then it states the promise and offers the signup form
    await expect(home.heading).toHaveText(
      'Toronto photo studios and outdoor spots, reviewed first-hand',
    );
    await expect(home.signup.email).toBeVisible();
    // And it shows the three most recent reviews with their facts, and links to every studio
    await expect
      .poll(() => home.cardNames())
      .toEqual(['Kensington Window Room', 'The Junction Loft', 'Leslieville Daylight Studio']);
    await expect(home.card('Kensington Window Room')).toContainText(
      'Kensington Market · Reviewed 3 Oct 2026',
    );
    await expect(home.card('Kensington Window Room')).toContainText('All-in 2 h$80.00');
    await expect(home.card('Kensington Window Room')).toContainText('Score3.2 out of 5');
    await expect(home.card('Kensington Window Room').getByRole('link')).toHaveAttribute(
      'href',
      '/studios/kensington-window-room',
    );
    await expect(home.allStudiosLink).toHaveAttribute('href', '/studios');
    // And the title is the site name
    await expect.poll(() => home.title()).toBe('ShotThere');
  });

  test('subscribes from the hero form with the home path as the source', async ({ page }) => {
    // Given the server accepts subscriptions
    await givenStudios(page, PUBLISHED_STUDIOS);
    const received = await givenSubscribeAnswers(page, 200);
    const home = new HomePage(page);
    await home.open();
    // When the visitor subscribes from the hero form
    await home.signup.subscribe('maya.chen@example.com');
    // Then the hero confirms it and the request names the home page
    await expect(home.signup.confirmation).toHaveText(
      "You're subscribed. We'll email maya.chen@example.com when a new review goes up.",
    );
    expect(received).toEqual([{ email: 'maya.chen@example.com', sourcePath: '/', website: '' }]);
  });

  test('says the first reviews are coming when nothing is published', async ({ page }) => {
    // Given no published studios
    await givenStudios(page, []);
    const home = new HomePage(page);
    await home.open();
    // Then the latest reviews say the first ones are coming
    await expect(home.firstReviewsComing).toBeVisible();
    // When the visitor asks for an email
    await home.emailMeLink.click();
    // Then focus moves to the hero email field
    await expect(home.signup.email).toBeFocused();
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1280]) {
      test(`shows an accessible empty reviews state in ${theme} mode at ${width}px`, async ({
        page,
      }) => {
        // Given no published studios, a window width and theme
        await givenStudios(page, []);
        await page.setViewportSize({ width, height: 800 });
        const shell = new ShellPage(page);
        await shell.rememberTheme(theme);
        const home = new HomePage(page);
        // When the home page loads
        await home.open();
        // Then the empty reviews state is accessible without horizontal scrolling
        await expect(home.firstReviewsComing).toBeVisible();
        expect(await shell.hasHorizontalScroll()).toBe(false);
        expect(await shell.accessibilityViolations()).toEqual([]);
      });
    }
  }

  test('still offers the signup when the latest reviews cannot load', async ({ page }) => {
    // Given the studio list fails
    await givenStudioListFails(page);
    const home = new HomePage(page);
    // When the visitor opens the home page
    await home.open();
    // Then the promise and the signup show, and the latest reviews section is left out
    await expect(home.heading).toBeVisible();
    await expect(home.signup.email).toBeVisible();
    await expect(home.latestReviews).toHaveCount(0);
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1280]) {
      test(`lays out without accessibility violations in ${theme} mode at ${width}px`, async ({
        page,
      }) => {
        // Given published studios and a window of this width and theme
        await givenStudios(page, PUBLISHED_STUDIOS);
        await page.setViewportSize({ width, height: 800 });
        const shell = new ShellPage(page);
        await shell.rememberTheme(theme);
        const home = new HomePage(page);
        // When the home page loads
        await home.open();
        await expect(home.latestCards).toHaveCount(3);
        // Then nothing scrolls sideways and axe finds no WCAG A/AA violations
        expect(await shell.hasHorizontalScroll()).toBe(false);
        expect(await shell.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
