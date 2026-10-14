import { givenStudio, givenStudios } from './fakes/fake-studios-api';
import { THE_JUNCTION_LOFT } from './fakes/studio-details';
import { PUBLISHED_STUDIOS } from './fakes/studio-summaries';
import { expect, test } from './fakes/test';
import { CompareBarPanel } from './pages/compare-bar.panel';
import { StudioListPage } from './pages/studio-list.page';
import { StudioPage } from './pages/studio.page';

test.describe('Selecting studios to compare', () => {
  test('adds a studio from its card and shows the compare bar', async ({ page }) => {
    // Given the studio list with nothing selected
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    await expect(bar.root).toBeHidden();
    // When the visitor activates Compare on a card
    await list.compareToggle('Kensington Window Room').click();
    // Then the bar shows one selected and the card's control becomes Remove
    await expect(bar.count).toHaveText('1 selected');
    await expect(bar.count).toHaveCount(1);
    await expect(bar.names).toHaveText('Kensington Window Room');
    await expect(list.compareToggle('Kensington Window Room')).toHaveAccessibleName(
      'Remove Kensington Window Room',
    );
    await expect(list.compareToggle('Kensington Window Room')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('needs at least two studios before it will compare', async ({ page }) => {
    // Given one studio selected
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    await list.compareToggle('The Junction Loft').click();
    // Then Compare is disabled with a hint
    await expect(bar.compareButton).toBeDisabled();
    await expect(bar.hint).toBeVisible();
    // When a second studio is added
    await list.compareToggle('Leslieville Daylight Studio').click();
    // Then Compare is enabled and the hint goes
    await expect(bar.compareButton).toBeEnabled();
    await expect(bar.hint).toBeHidden();
  });

  test('refuses a fifth studio and says the maximum is 4', async ({ page }) => {
    // Given four studios selected
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    for (const studio of PUBLISHED_STUDIOS.slice(0, 4)) {
      await list.compareToggle(studio.name).click();
    }
    await expect(bar.count).toHaveText('4 selected');
    // When the visitor tries to add a fifth
    await list.compareToggle('Ossington Blackbox').click();
    // Then it is refused, a message states the maximum, and it is announced
    await expect(bar.count).toHaveText('4 selected');
    await expect(bar.limitToast).toContainText(
      'Remove one from the bar to add Ossington Blackbox.',
    );
    await expect(list.compareToggle('Ossington Blackbox')).toHaveAccessibleName(
      'Compare Ossington Blackbox',
    );
    await expect(list.announcer).toHaveText(
      'You can compare up to 4 studios. Remove one from the bar to add Ossington Blackbox.',
    );
  });

  test('opens the comparison of the selected studios', async ({ page }) => {
    // Given two studios selected
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    await list.compareToggle('The Junction Loft').click();
    await list.compareToggle('Leslieville Daylight Studio').click();
    // When the visitor activates Compare in the bar
    await bar.compareButton.click();
    // Then the comparison page opens for those two
    await expect
      .poll(() => list.currentPath())
      .toBe('/compare?studios=the-junction-loft,leslieville-daylight-studio');
  });

  test('keeps the selection when the page reloads', async ({ page }) => {
    // Given two studios selected
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    await list.compareToggle('The Junction Loft').click();
    await list.compareToggle('Riverside Rooftop Studio').click();
    // When the visitor reloads
    await list.reload();
    // Then the selection is still there
    await expect(bar.count).toHaveText('2 selected');
    await expect(list.compareToggle('Riverside Rooftop Studio')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('clears the selection from the bar', async ({ page }) => {
    // Given a selection
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.open();
    await list.compareToggle('The Junction Loft').click();
    // When the visitor presses Clear
    await bar.clearButton.click();
    // Then the bar goes and the card offers Compare again
    await expect(bar.root).toBeHidden();
    await expect(list.compareToggle('The Junction Loft')).toHaveAttribute('aria-pressed', 'false');
  });

  test('adds a studio from its own page', async ({ page }) => {
    // Given a studio page
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    const bar = new CompareBarPanel(page);
    await studio.open('the-junction-loft');
    // When the visitor activates Compare there
    await studio.compareToggle('The Junction Loft').click();
    // Then the bar shows it
    await expect(bar.count).toHaveText('1 selected');
    await expect(studio.compareToggle('The Junction Loft')).toHaveAccessibleName(
      'Remove The Junction Loft',
    );
  });

  test('pins the bar to the bottom on a phone without covering the end of the page', async ({
    page,
  }) => {
    // Given a selection at phone width
    await givenStudios(page, PUBLISHED_STUDIOS);
    const list = new StudioListPage(page);
    const bar = new CompareBarPanel(page);
    await list.usePhoneWidth();
    await list.open();
    await list.compareToggle('The Junction Loft').click();
    // Then the bar sits on the bottom edge, and the end of the page scrolls clear of it
    await expect(bar.root).toBeVisible();
    expect(await bar.isPinnedToBottom()).toBe(true);
    expect(await bar.leavesPageEndUncovered()).toBe(true);
  });
});
