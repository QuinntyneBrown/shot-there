import { givenStudios } from './fakes/fake-studios-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { StudioListPage } from './pages/studio-list.page';

test.describe('Studio list', () => {
  test('shows every published studio as a card, in the order the API returns', async ({ page }) => {
    // Given seven published studios
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens the studio list
    await list.open();
    // Then there is one card per studio, most recent review first, and the count
    await expect(list.heading).toHaveText('Studios');
    await expect(list.resultCount).toHaveText('7 studios');
    expect(await list.cardNames()).toEqual(PUBLISHED_STUDIOS.map((s) => s.name));
    await expect(page).toHaveTitle('Studios · ShotThere');
  });

  test('shows name, neighbourhood, review date, all-in cost and score on each card', async ({ page }) => {
    // Given seven published studios
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens the studio list
    await list.open();
    // Then a card shows its facts and links to the studio page
    const card = list.card('Kensington Window Room');
    await expect(card).toContainText('Kensington Market · Reviewed 3 Oct 2026');
    await expect(card).toContainText('All-in 2 h$80.00');
    await expect(card).toContainText('Score3.2 out of 5');
    await expect(list.cardLink('Kensington Window Room')).toHaveAttribute('href', '/studios/kensington-window-room');
    await expect(card).not.toContainText('Prices may be out of date');
  });

  test('flags a studio whose prices are stale', async ({ page }) => {
    // Given a studio whose price verification is more than six months old
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens the studio list
    await list.open();
    // Then its card says the prices may be out of date
    await expect(list.card('Ossington Blackbox')).toContainText('Prices may be out of date');
  });

  test('says so when no studio is published yet', async ({ page }) => {
    // Given no published studios
    await givenStudios(page, []);
    const list = new StudioListPage(page);
    // When the visitor opens the studio list
    await list.open();
    // Then the empty state explains it
    await expect(list.emptyState).toBeVisible();
    await expect(list.cards).toHaveCount(0);
  });
});
