import { expect, test } from '@playwright/test';
import { EmptyStateComponent } from '../components/empty-state.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('EmptyStateComponent (ICD-002 §9.7, CRD empty-state)', () => {
  test('renders an icon, an h2 title by default, text and actions', async ({ page }) => {
    // Given the default empty state with one action
    const harness = new HarnessPage(page);
    await harness.open('empty-state/states');
    const empty = new EmptyStateComponent(page, 'No studio reviews yet');
    // Then it is a .empty with a hidden icon, an h2 title, its text and the slotted action
    expect(await empty.classes()).toEqual(['empty']);
    await expect(empty.icon()).toHaveAttribute('aria-hidden', 'true');
    expect(await empty.titleLevel()).toBe(2);
    await expect(empty.text()).toContainText('The first reviews are being shot now.');
    expect(await empty.actionNames()).toEqual(['Browse outdoor spots']);
    expect(harness.errors).toEqual([]);
  });

  test('error tone adds .empty--error and keeps both actions in order', async ({ page }) => {
    // Given the error empty state
    const harness = new HarnessPage(page);
    await harness.open('empty-state/states');
    const empty = new EmptyStateComponent(page, "We couldn't load the studios");
    // Then it carries the tone modifier and both actions
    expect(await empty.classes()).toEqual(['empty', 'empty--error']);
    expect(await empty.actionNames()).toEqual(['Try again', 'Go to the home page']);
  });

  test('compact success adds both modifiers and takes no space for missing actions', async ({
    page,
  }) => {
    // Given the compact success empty state without actions
    const harness = new HarnessPage(page);
    await harness.open('empty-state/states');
    const empty = new EmptyStateComponent(page, 'Everything is up to date');
    // Then it has .empty--compact and .empty--success and its actions element is not displayed
    expect((await empty.classes()).sort()).toEqual(['empty', 'empty--compact', 'empty--success']);
    await expect(empty.actions()).toBeHidden();
  });

  test('renders the title at the heading level it is given and no icon without one', async ({
    page,
  }) => {
    // Given a compact empty state at level 4 with no icon
    const harness = new HarnessPage(page);
    await harness.open('empty-state/states');
    const empty = new EmptyStateComponent(page, 'Studio reviews are coming');
    // Then the title is an h4 and there is no icon box
    expect(await empty.titleLevel()).toBe(4);
    await expect(empty.icon()).toHaveCount(0);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('empty-state/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
