import { expect, test } from '@playwright/test';
import { ErrorPageComponent } from '../components/error-page.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ErrorPageComponent (ICD-002 §9.7, CRD error-page)', () => {
  test('not found renders the code, the h1, the text and the actions in order', async ({
    page,
  }) => {
    // Given the not-found page
    const harness = new HarnessPage(page);
    await harness.open('error-page/not-found');
    const error = new ErrorPageComponent(page);
    // Then the code, the h1 and the text read in order, followed by the actions
    expect(await error.classes()).toEqual(['system-page']);
    expect(await error.lines()).toEqual([
      'Error 404',
      "We couldn't find that page",
      "It may have been renamed, or the location isn't published.",
      'Go to the home pageBrowse studios',
    ]);
    await expect(error.heading()).toHaveText("We couldn't find that page");
    await expect(error.actions()).toHaveText(['Go to the home page', 'Browse studios']);
    expect(harness.errors).toEqual([]);
  });

  test('server error shows the projected paragraph before the reference and never a stack trace', async ({
    page,
  }) => {
    // Given the server error page with a reference
    const harness = new HarnessPage(page);
    await harness.open('error-page/server-error');
    const error = new ErrorPageComponent(page);
    // Then the paragraph comes before the reference, which comes before the actions
    const lines = await error.lines();
    expect(lines[0]).toBe('Something went wrong on our side');
    expect(lines[1]).toContain('hello@shotthere.ca');
    expect(lines[2]).toBe('Reference 7f3a-91c2');
    await expect(error.code()).toHaveText('Reference 7f3a-91c2');
  });

  for (const route of ['not-found', 'server-error']) {
    for (const theme of ['light', 'dark'] as HarnessTheme[]) {
      for (const width of [320, 1280]) {
        test(`${route} has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({
          page,
        }) => {
          const harness = new HarnessPage(page);
          await harness.open('error-page/' + route, { width, theme });
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
