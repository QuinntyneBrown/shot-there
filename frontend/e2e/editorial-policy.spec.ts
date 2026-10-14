import { expect, test } from './fakes/test';
import { EditorialPolicyPage } from './pages/editorial-policy.page';
import { ShellPage } from './pages/shell.page';

test.describe('Editorial policy page', () => {
  test('states the rules every review follows', async ({ page }) => {
    // Given the editorial policy page, with no API available
    const policy = new EditorialPolicyPage(page);
    // When a visitor opens it
    await policy.open();
    // Then it is titled and states each rule L2-046 requires
    await expect(policy.heading).toHaveText('Editorial policy');
    await expect(policy.rule("We only list places we've shot")).toBeVisible();
    await expect(policy.rule('Scores are never for sale')).toBeVisible();
    await expect(policy.rule('We tell you how each session was paid for')).toBeVisible();
    await expect(policy.policy).toContainText('Comped:');
    await expect(policy.rule('Owners can correct facts, not reviews')).toBeVisible();
    await expect(policy.rule('We publish the bad with the good')).toBeVisible();
    await expect(policy.rule('No paid placement')).toBeVisible();
    // And the title carries the site suffix
    await expect.poll(() => policy.title()).toBe('Editorial policy · ShotThere');
  });

  test('is reached from the footer of every page', async ({ page }) => {
    // Given any page
    const shell = new ShellPage(page);
    await shell.open();
    // When the visitor follows the footer's Editorial policy link
    await shell.footerLink('Editorial policy').click();
    // Then the editorial policy page opens
    await expect(new EditorialPolicyPage(page).heading).toHaveText('Editorial policy');
  });

  for (const width of [320, 1280]) {
    test(`lays out without horizontal scrolling or accessibility violations at ${width}px`, async ({
      page,
    }) => {
      // Given a window of this width
      const shell = new ShellPage(page);
      await page.setViewportSize({ width, height: 800 });
      // When the policy page loads
      const policy = new EditorialPolicyPage(page);
      await policy.open();
      await expect(policy.heading).toHaveText('Editorial policy');
      // Then nothing scrolls sideways and axe finds no WCAG A/AA violations
      expect(await shell.hasHorizontalScroll()).toBe(false);
      expect(await shell.accessibilityViolations()).toEqual([]);
    });
  }
});
