import { givenStudios } from './fakes/fake-studios-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { StudioListPage } from './pages/studio-list.page';

const byCost = [...PUBLISHED_STUDIOS].sort((a, b) => a.allInCost2h - b.allInCost2h);

test.describe('Studio sort', () => {
  test('defaults to most recent review and sends no sort', async ({ page }) => {
    // Given published studios
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens the list with no sort in the URL
    await list.open();
    // Then the sort control shows the default and the request carries no sort
    await expect(list.cards).toHaveCount(7);
    expect(await list.selectedSort()).toBe('Most recent review');
    expect(requests.at(-1)?.has('sort')).toBe(false);
  });

  test('sorts by all-in cost, puts it in the URL and announces it', async ({ page }) => {
    // Given the studio list
    const recentRequests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open();
    await expect(list.cards).toHaveCount(7);
    // When the visitor sorts by all-in cost (and the API answers in that order)
    const costRequests = await givenStudios(page, byCost);
    await list.sortBy('All-in cost, low to high');
    // Then the URL and the request carry the sort, the cards follow the answer, and the change is announced
    await expect.poll(() => list.currentQuery().get('sort')).toBe('cost');
    await expect.poll(() => list.cardNames()).toEqual(byCost.map((s) => s.name));
    expect(costRequests.at(-1)?.get('sort')).toBe('cost');
    expect(recentRequests).toHaveLength(1);
    expect(await list.selectedSort()).toBe('All-in cost, low to high');
    await expect(list.announcer).toHaveText('Sorted by all-in cost, low to high');
  });

  test('opens a shared URL with its sort applied', async ({ page }) => {
    // Given a URL sorted by overall score
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it
    await list.open('?sort=score');
    // Then the request and the sort control use that sort
    await expect(list.cards).toHaveCount(7);
    expect(requests.at(-1)?.get('sort')).toBe('score');
    expect(await list.selectedSort()).toBe('Overall score, high to low');
  });

  test('restores the previous sort when the visitor goes back', async ({ page }) => {
    // Given the visitor sorted the list by cost
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    await list.open();
    await expect(list.cards).toHaveCount(7);
    await list.sortBy('All-in cost, low to high');
    await expect.poll(() => list.currentQuery().get('sort')).toBe('cost');
    // When they press Back
    await list.goBack();
    // Then the default sort returns, in the control and in the request
    await expect.poll(() => list.selectedSort()).toBe('Most recent review');
    await expect.poll(() => requests.at(-1)?.has('sort')).toBe(false);
  });

  test('ignores an unknown sort in the URL', async ({ page }) => {
    // Given a URL with a sort the site does not offer
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it
    await list.open('?sort=price-desc');
    // Then the list loads with the default sort and no error
    await expect(list.cards).toHaveCount(7);
    expect(requests.at(-1)?.has('sort')).toBe(false);
    expect(await list.selectedSort()).toBe('Most recent review');
  });
});
