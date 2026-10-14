import { expect, test } from '@playwright/test';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Cards, shots, tables, uploads, image rows and maps (ICD-002 §9.4 to §9.6)', () => {
  test('a location card links its name over the whole card, shows meta, facts with a stale badge and projected parts', async ({ page }) => {
    // Given the location grid
    const harness = new HarnessPage(page);
    await harness.open('location-card/states');
    // Then the first card's name is an h3 link to the review
    const card = page.locator('.location-card', { hasText: 'The Junction Loft' });
    await expect(card.getByRole('heading', { level: 3 }).getByRole('link', { name: 'The Junction Loft' })).toHaveAttribute('href', '/studios/the-junction-loft');
    await expect(card).toContainText('Junction · Reviewed 3 Oct 2026');
    await expect(card.locator('.location-card__facts')).toContainText('$145.00');
    await expect(card.locator('.badge')).toHaveText('Prices may be out of date');
    await expect(card.getByRole('list', { name: 'Best uses' })).toBeVisible();
    await expect(card.getByRole('button', { name: 'Compare' })).toBeVisible();
    await expect(card).toContainText('Verified 22 Sep 2026');
    // And the photo is decorative
    await expect(card.locator('img')).toHaveAttribute('alt', '');
    expect(harness.errors).toEqual([]);
  });

  test('a ranked card at level 2 shows an aria-hidden rank, and the skeleton is hidden from assistive technology', async ({ page }) => {
    // Given the location grid
    const harness = new HarnessPage(page);
    await harness.open('location-card/states');
    // Then the second card has an h2 and a hidden rank, and the skeleton is aria-hidden
    const card = page.locator('.location-card', { hasText: 'Ossington Blackbox' });
    await expect(card.getByRole('heading', { level: 2, name: 'Ossington Blackbox' })).toBeVisible();
    await expect(card.locator('.guide-entry__rank')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.location-card--skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  test('the location grid has one column on a phone and three on desktop', async ({ page }) => {
    // Given the grid at 320px
    const harness = new HarnessPage(page);
    await harness.open('location-card/states', { width: 320 });
    const columns = () => page.locator('.location-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(await columns()).toBe(1);
    // And at 1280px
    await harness.open('location-card/states', { width: 1280 });
    expect(await columns()).toBe(3);
  });

  test('a shot grid has a setup line, a button per shot named by its alt, and reports the pressed index', async ({ page }) => {
    // Given the shot grid
    const harness = new HarnessPage(page);
    await harness.open('shot-grid/default');
    await expect(page.getByText('Shot on a 35 mm lens at f/2.8.')).toBeVisible();
    const shots = page.getByRole('button', { name: 'Close portrait against the brick wall.' });
    await expect(shots).toHaveCount(2);
    await expect(page.locator('figcaption').first()).toHaveText('Standard Octabox at 45 degrees.');
    // When the second shot is pressed
    await shots.nth(1).click();
    // Then its index is reported
    await expect.poll(() => harness.activations()).toEqual(['shot: 1']);
  });

  test('a table keeps the native structure and stacks into labelled cards on a phone', async ({ page }) => {
    // Given the table on a phone
    const harness = new HarnessPage(page);
    await harness.open('table/states', { width: 360 });
    // Then the header row is visually removed and each cell shows its label above its value
    await expect(page.getByRole('table', { name: 'Studios' })).toBeVisible();
    const cell = page.locator('td[data-label="All-in"]').first();
    expect(await cell.evaluate((el) => getComputedStyle(el, '::before').content)).toContain('All-in');
    expect(await cell.evaluate((el) => getComputedStyle(el).display)).toBe('block');
    // And on desktop it is a normal table
    await harness.open('table/states', { width: 1280 });
    expect(await page.locator('td[data-label="All-in"]').first().evaluate((el) => getComputedStyle(el).display)).toBe('table-cell');
  });

  test('a file upload names its trigger, shows the hint and refused-file alert, and reports chosen files', async ({ page }) => {
    // Given the upload
    const harness = new HarnessPage(page);
    await harness.open('file-upload/states');
    // Then the visible trigger names the hidden input and the errors are announced
    await expect(page.getByText('JPEG, PNG, WebP or AVIF, up to 20 MB each.')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveText('raw-export.tif is 25 MB. The limit is 20 MB.');
    // When files are chosen
    await page.getByLabel('Add test shots').setInputFiles([{ name: 'a.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('a') }]);
    // Then they are reported
    await expect.poll(() => harness.activations()).toEqual(['files: a.jpg']);
  });

  test('image rows show a thumbnail, uploading progress and a failed alert', async ({ page }) => {
    // Given the image list
    const harness = new HarnessPage(page);
    await harness.open('image-row/states');
    const rows = page.getByRole('list').getByRole('listitem');
    await expect(rows).toHaveCount(3);
    // Then the uploading row has a named progress bar and hidden status text
    await expect(rows.nth(1).getByRole('progressbar', { name: 'Uploading gallery-02.jpg' })).toBeVisible();
    await expect(rows.nth(1).locator('.image-row__meta[aria-hidden="true"]')).toHaveText('45%');
    // And the failed row announces its error
    await expect(rows.nth(2).getByRole('alert')).toHaveText('gallery-04.jpg did not upload. Check your connection.');
    // And row actions are named buttons
    await expect(rows.nth(0).getByRole('button', { name: 'Remove headshot.jpg' })).toBeVisible();
  });

  test('the map popup is a named dialog with a link, closes with Escape, and the legend and notice render', async ({ page }) => {
    // Given the map parts
    const harness = new HarnessPage(page);
    await harness.open('map-popup/states');
    const popup = page.getByRole('dialog', { name: 'The Junction Loft' });
    // Then the popup shows kind, fact and a link whose name includes the studio
    await expect(popup).toContainText('Studio');
    await expect(popup).toContainText('All-in for 2 hours: $145.00');
    await expect(popup.getByRole('link', { name: 'View the review The Junction Loft' })).toHaveAttribute('href', '/studios/the-junction-loft');
    // And the legend lists both marker types and the notice is a status with its action
    await expect(page.getByRole('list', { name: 'Legend' })).toContainText('Outdoor spot');
    await expect(page.getByRole('status')).toContainText('The map did not load');
    await expect(page.getByRole('link', { name: 'Show the list' })).toBeVisible();
    // When Escape is pressed in the popup
    await popup.getByRole('button', { name: 'Close' }).focus();
    await page.keyboard.press('Escape');
    // Then the application hears it
    await expect.poll(() => harness.activations()).toEqual(['closed']);
  });

  test('the search field expands a listbox, moves with arrow keys, selects with Enter and announces results', async ({ page }) => {
    // Given the search field
    const harness = new HarnessPage(page);
    await harness.open('search-field/default');
    const field = page.getByRole('combobox', { name: 'Find a studio or spot' });
    await expect(field).toHaveAttribute('aria-expanded', 'false');
    // When the visitor types "ju"
    await field.fill('ju');
    // Then the listbox opens with two matches and announces the count
    await expect(field).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox', { name: 'Matching studios and spots' }).getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('status')).toHaveText('2 results');
    // When ArrowDown then Enter are pressed
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    // Then the first option is selected
    await expect.poll(() => harness.activations()).toEqual(['selected: The Junction Loft']);
    // And no matches says so
    await field.fill('zzz');
    await expect(page.getByRole('status')).toHaveText('No matches');
  });

  for (const route of ['location-card/states', 'shot-grid/default', 'table/states', 'file-upload/states', 'image-row/states', 'map-popup/states', 'search-field/default']) {
    for (const theme of ['light', 'dark'] as HarnessTheme[]) {
      for (const width of [320, 1280]) {
        test(route + ' has no WCAG A/AA violations at ' + width + 'px in the ' + theme + ' theme', async ({ page }) => {
          const harness = new HarnessPage(page);
          await harness.open(route, { width, theme });
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
