import { givenStudios } from './fakes/fake-studios-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { ShellPage } from './pages/shell.page';
import { StudioListPage } from './pages/studio-list.page';

const leslievilleOnly = PUBLISHED_STUDIOS.filter((s) => s.slug === 'leslieville-daylight-studio');

test.describe('Studio filters dialog', () => {
  test.beforeEach(async ({ page }) => {
    await new StudioListPage(page).usePhoneWidth();
  });

  test('shows how many filters are active on the Filters button', async ({ page }) => {
    // Given a URL with a neighbourhood and the cyc wall filter
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it at phone width
    await list.open('?hood=junction&cyc=yes');
    // Then the Filters button says two filters are active
    await expect(list.filtersButton).toHaveAccessibleName('Filters, 2 active');
  });

  test('opens full height, counts matches as filters change and applies them with Show', async ({
    page,
  }) => {
    // Given the studio list at phone width
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open();
    await expect(list.cards).toHaveCount(7);
    // When the visitor opens the filters
    await list.openFiltersDialog();
    // Then a full-height dialog offers to show all seven studios
    await expect(list.filtersDialog).toBeVisible();
    await expect(list.dialogShowButton).toHaveText('Show 7 studios');
    expect(await list.filtersDialog.evaluate((el) => el.getBoundingClientRect().height)).toBe(700);
    // When they choose Leslieville (which one studio matches)
    await givenStudios(page, leslievilleOnly);
    await list.dialogFilters.check('Leslieville');
    // Then the Show button counts the match without applying it yet
    await expect(list.dialogShowButton).toHaveText('Show 1 studio');
    expect(list.currentQuery().toString()).toBe('');
    // When they press Show
    await list.dialogShowButton.click();
    // Then the dialog closes, the filter is applied, and focus returns to the Filters button
    await expect(list.filtersDialog).toBeHidden();
    await expect.poll(() => list.currentQuery().toString()).toBe('hood=leslieville');
    await expect(list.cards).toHaveCount(1);
    await expect(list.filtersButton).toBeFocused();
  });

  test('applies the selected sort only when the visitor presses Show', async ({ page }) => {
    // Given the filters dialog is open on an unsorted list
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open();
    await list.openFiltersDialog();
    // When the visitor chooses a sort
    await list.dialogSortBy('cost');
    // Then it remains unapplied until Show
    expect(list.currentQuery().toString()).toBe('');
    await list.dialogShowButton.click();
    // Then the selected sort is applied
    await expect.poll(() => list.currentQuery().toString()).toBe('sort=cost');
  });

  test('explains an inverted cost range and will not apply it', async ({ page }) => {
    // Given the filters dialog is open
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open();
    await list.openFiltersDialog();
    // When the visitor enters a minimum above the maximum
    await list.dialogFilters.setCostRange('200', '100');
    // Then the dialog explains it and Show is disabled
    await expect(list.dialogCostError).toBeVisible();
    await expect(list.dialogFilters.costMaximum).toHaveAttribute('aria-invalid', 'true');
    await expect(list.dialogShowButton).toBeDisabled();
  });

  test('discards unapplied changes when closed with Escape', async ({ page }) => {
    // Given the filters dialog is open with a new choice
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open('?sort=cost');
    await list.openFiltersDialog();
    await list.dialogFilters.check('Junction');
    // When the visitor presses Escape
    await list.closeDialogWithEscape();
    // Then nothing is applied and focus returns to the Filters button
    await expect(list.filtersDialog).toBeHidden();
    expect(list.currentQuery().toString()).toBe('sort=cost');
    await expect(list.filtersButton).toBeFocused();
  });

  test('clears every filter but keeps the sort', async ({ page }) => {
    // Given the dialog is open on a filtered, sorted list
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open('?hood=junction&cyc=yes&sort=score');
    await list.openFiltersDialog();
    await expect(list.dialogFilters.checkbox('Junction')).toBeChecked();
    // When the visitor presses Clear all and then Show
    await list.dialogClearAllButton.click();
    await expect(list.dialogFilters.checkbox('Junction')).not.toBeChecked();
    await list.dialogShowButton.click();
    // Then only the sort remains
    await expect.poll(() => list.currentQuery().toString()).toBe('sort=score');
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1280]) {
      test(`has no accessibility violations in the ${theme} theme at ${width}px`, async ({
        page,
      }) => {
        // Given the filters dialog is open in the requested theme
        const shell = new ShellPage(page);
        const list = new StudioListPage(page);
        await shell.rememberTheme(theme);
        await givenStudios(page, PUBLISHED_STUDIOS);
        await list.usePhoneWidth();
        await list.open();
        await list.openFiltersDialog();
        if (width === 1280) await list.useDesktopWidth();
        // Then axe finds no WCAG A/AA violations
        expect(await shell.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
