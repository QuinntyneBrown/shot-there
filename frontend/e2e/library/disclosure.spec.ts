import { expect, test } from '@playwright/test';
import { DisclosureComponent } from '../components/disclosure.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('DisclosureComponent (ICD-002 §9.5, CRD disclosure)', () => {
  test('is a callout with a hidden info icon, a title and the projected statement and link', async ({
    page,
  }) => {
    // Given the paid-for disclosure
    const harness = new HarnessPage(page);
    await harness.open('disclosure/default');
    const disclosure = new DisclosureComponent(page);
    // Then it shows the title, the statement and the policy link, with a decorative icon
    await expect(disclosure.title()).toHaveText('How this session was paid for');
    await expect(disclosure.statement()).toContainText('I paid the full rate for this session.');
    await expect(
      disclosure.statement().getByRole('link', { name: 'Editorial policy' }),
    ).toHaveAttribute('href', '/editorial-policy');
    await expect(disclosure.icon()).toHaveAttribute('aria-hidden', 'true');
    // And it has the thick left edge of the DS callout
    expect(await disclosure.edgeWidth()).toBe(2);
    expect(harness.errors).toEqual([]);
  });

  test('has no tooltip from its title attribute', async ({ page }) => {
    // Given the disclosure with title input
    const harness = new HarnessPage(page);
    await harness.open('disclosure/default');
    // Then the host carries no title attribute
    expect(await new DisclosureComponent(page).root.getAttribute('title')).toBeNull();
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('disclosure/default', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
