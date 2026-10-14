import { givenStudios } from './fakes/fake-studios-api';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { StudioListPage } from './pages/studio-list.page';

test.describe('Studio filters in the URL', () => {
  test('applies every filter in a shared URL to the studio request', async ({ page }) => {
    // Given a URL holding every kind of filter and a sort
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it
    await list.open(
      '?costMin=100&costMax=150&hood=leslieville&hood=junction&light=medium&cyc=yes&space=30&gear=lights&gear=stands&parking=on-site&sort=cost',
    );
    // Then the studio request carries the same filters and sort
    await expect(list.cards).toHaveCount(7);
    const sent = requests.at(-1)!;
    expect(sent.get('costMin')).toBe('100');
    expect(sent.get('costMax')).toBe('150');
    expect(sent.getAll('hood')).toEqual(['leslieville', 'junction']);
    expect(sent.get('light')).toBe('medium');
    expect(sent.get('cyc')).toBe('yes');
    expect(sent.get('space')).toBe('30');
    expect(sent.getAll('gear')).toEqual(['lights', 'stands']);
    expect(sent.get('parking')).toBe('on-site');
    expect(sent.get('sort')).toBe('cost');
  });

  test('ignores unknown filter values and keeps the valid ones', async ({ page }) => {
    // Given a URL mixing valid filters with values the site does not offer
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it
    await list.open(
      '?hood=atlantis&hood=riverside&gear=drones&parking=boat&space=12&costMin=cheap&light=bright&cyc=maybe',
    );
    // Then only the valid filter reaches the request and the list shows without an error
    await expect(list.cards).toHaveCount(7);
    const sent = requests.at(-1)!;
    expect([...sent.keys()]).toEqual(['hood']);
    expect(sent.getAll('hood')).toEqual(['riverside']);
  });

  test('treats a minimum cost above the maximum as no cost range', async ({ page }) => {
    // Given a URL whose cost minimum is greater than its maximum
    const requests = await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    // When the visitor opens it
    await list.open('?costMin=200&costMax=100&cyc=yes');
    // Then the range is dropped and the other filters still apply
    await expect(list.cards).toHaveCount(7);
    const sent = requests.at(-1)!;
    expect(sent.has('costMin')).toBe(false);
    expect(sent.has('costMax')).toBe(false);
    expect(sent.get('cyc')).toBe('yes');
  });
});
