import { givenStudios } from './fakes/fake-studios-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { StudioListPage } from './pages/studio-list.page';

const leslievilleAndJunction = PUBLISHED_STUDIOS.filter((s) =>
  ['leslieville-daylight-studio', 'the-junction-loft'].includes(s.slug),
);

test.describe('Studio filters sidebar', () => {
  test('applies the chosen filters, keeping the sort, and announces the new count', async ({
    page,
  }) => {
    // Given the studio list sorted by cost on a desktop
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.useDesktopWidth();
    await list.open('?sort=cost');
    await expect(list.cards).toHaveCount(7);
    // When the visitor picks filters in the sidebar and applies them
    const requests = await givenStudios(page, leslievilleAndJunction);
    const filters = list.filtersSidebar;
    await filters.setCostRange('100', '150');
    await filters.check('Leslieville', 'Junction', 'Natural light', 'Cyc wall', 'Lights');
    await filters.chooseMinimumSpace('30 m² or more');
    await filters.chooseParking('On-site');
    await list.applyFiltersButton.click();
    // Then the URL and the request carry the filters and the sort, and the count is announced
    await expect
      .poll(() => list.currentQuery().toString())
      .toBe(
        'costMin=100&costMax=150&hood=junction&hood=leslieville&light=medium&cyc=yes&space=30&gear=lights&parking=on-site&sort=cost',
      );
    await expect(list.cards).toHaveCount(2);
    expect(requests.at(-1)?.getAll('hood')).toEqual(['junction', 'leslieville']);
    await expect(list.announcer).toHaveText('2 studios');
  });

  test('shows the filters from a shared URL in the sidebar', async ({ page }) => {
    // Given a URL with filters
    await givenStudios(page, leslievilleAndJunction);
    const list = new StudioListPage(page);
    await list.useDesktopWidth();
    // When the visitor opens it
    await list.open('?hood=leslieville&costMax=150&space=30&parking=street');
    // Then the sidebar shows them
    const filters = list.filtersSidebar;
    await expect(filters.checkbox('Leslieville')).toBeChecked();
    await expect(filters.checkbox('Junction')).not.toBeChecked();
    await expect(filters.costMaximum).toHaveValue('150');
    await expect(filters.costMinimum).toHaveValue('');
    expect(await filters.selectedMinimumSpace()).toBe('30 m² or more');
    await expect(filters.parking('Street')).toBeChecked();
  });

  test('shows no cost range when the URL range is inverted', async ({ page }) => {
    // Given a URL whose minimum cost is above its maximum
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.useDesktopWidth();
    // When the visitor opens it
    await list.open('?costMin=200&costMax=100');
    // Then the cost range controls are empty
    await expect(list.filtersSidebar.costMinimum).toHaveValue('');
    await expect(list.filtersSidebar.costMaximum).toHaveValue('');
  });

  test('explains when nothing matches and clears the filters', async ({ page }) => {
    // Given filters that match no studio
    await givenStudios(page, []);
    const list = new StudioListPage(page);
    await list.useDesktopWidth();
    await list.open('?cyc=yes&parking=none&sort=score');
    // Then the page says no studios match
    await expect(list.noMatches).toBeVisible();
    // When the visitor clears the filters
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    await list.clearFiltersButton.click();
    // Then every filter is removed, the sort stays and the studios show
    await expect.poll(() => list.currentQuery().toString()).toBe('sort=score');
    await expect(list.cards).toHaveCount(7);
    expect([...requests.at(-1)!.keys()]).toEqual(['sort']);
  });

  test('keeps the sidebar out of the way at phone width', async ({ page }) => {
    // Given a phone-width window
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.usePhoneWidth();
    // When the visitor opens the list
    await list.open();
    // Then the sidebar is not shown
    await expect(list.cards).toHaveCount(7);
    await expect(list.filtersSidebar.root).toBeHidden();
  });
});
