import { expect, test } from '@playwright/test';
import { SpinnerComponent } from '../components/spinner.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('SpinnerComponent (ICD-002 §9.7, CRD spinner)', () => {
  test('renders a 20px aria-hidden ring and the default hidden label "Loading"', async ({
    page,
  }) => {
    // Given a spinner with no inputs
    const harness = new HarnessPage(page);
    // When the route opens
    await harness.open('spinner/default');
    // Then its ring is .spinner with no size modifier, 20px, with a 2px border, and the label reads "Loading"
    const spinner = new SpinnerComponent(page, 0);
    expect(await spinner.classes()).toEqual(['spinner']);
    await expect(spinner.ring).toHaveAttribute('aria-hidden', 'true');
    expect(await spinner.size()).toEqual({ width: 20, height: 20 });
    expect(await spinner.borderWidth()).toBe(2);
    await expect(spinner.label()).toHaveText('Loading');
    expect(harness.errors).toEqual([]);
  });

  test('is 16px when small and 40px when large, and takes its label from the input', async ({
    page,
  }) => {
    // Given a small spinner labelled "Searching…" and a large one labelled "Loading studios…"
    const harness = new HarnessPage(page);
    await harness.open('spinner/default');
    // Then each has its modifier, size and label
    const small = new SpinnerComponent(page, 1);
    expect(await small.classes()).toEqual(['spinner', 'spinner--sm']);
    expect(await small.size()).toEqual({ width: 16, height: 16 });
    await expect(small.label()).toHaveText('Searching…');
    const large = new SpinnerComponent(page, 2);
    expect(await large.classes()).toEqual(['spinner', 'spinner--lg']);
    expect(await large.size()).toEqual({ width: 40, height: 40 });
    await expect(large.label()).toHaveText('Loading studios…');
  });

  test('is announced only through the status element of the consumer', async ({ page }) => {
    // Given a spinner inside a role=status element
    const harness = new HarnessPage(page);
    await harness.open('spinner/default');
    // Then the status text is the label of the spinner alone, the ring being hidden
    await expect(page.getByRole('status')).toMatchAriaSnapshot('- status: Searching…');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('spinner/default', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
