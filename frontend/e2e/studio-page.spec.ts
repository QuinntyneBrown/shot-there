import { givenNoStudio, givenStudio } from './fakes/fake-studios-api';
import { OSSINGTON_BLACKBOX, THE_JUNCTION_LOFT } from './fakes/studio-details';
import { expect, test } from './fakes/test';
import { StudioPage } from './pages/studio.page';

test.describe('Studio page: basics and pricing', () => {
  test('names the studio once, says where it is and links to its booking page', async ({
    page,
  }) => {
    // Given a published studio
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then the name is the only level-one heading, with neighbourhood and address beneath
    await expect(studio.heading).toHaveText('The Junction Loft');
    await expect(studio.headings).toHaveCount(1);
    await expect(studio.basics).toContainText('Junction');
    await expect(studio.basics).toContainText('Dundas St W at Pacific Ave, 2nd floor');
    // And the booking link opens the studio's own page in a new tab
    await expect(studio.bookingLink).toHaveAttribute(
      'href',
      'https://thejunctionloft.example/book',
    );
    await expect(studio.bookingLink).toHaveAttribute('target', '_blank');
    await expect(studio.bookingLink).toHaveAttribute('rel', 'noopener');
    await expect.poll(() => studio.title()).toBe('The Junction Loft · ShotThere');
  });

  test('shows the rate, minimum, each fee and the all-in cost from the server', async ({
    page,
  }) => {
    // Given a studio at $60 an hour, 2-hour minimum, a mandatory $25 cleaning fee and an optional $30 add-on
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then the pricing block shows the server's all-in cost and labels each fee
    await expect(studio.allInCost).toContainText('$145.00');
    await expect(studio.allInCost).toContainText(
      'All-in for a standard 2-hour shoot: 2 hours at $60.00 plus mandatory fees.',
    );
    await expect(studio.priceRow('Hourly rate')).toHaveText('$60.00');
    await expect(studio.priceRow('Minimum booking')).toHaveText('2 hours');
    await expect(studio.priceRow('Cleaning fee')).toHaveText('$25.00 Mandatory');
    await expect(studio.priceRow('After-hours access')).toHaveText(
      '$30.00 Optional, not in all-in',
    );
    await expect(studio.pricing).toContainText('Prices verified 22 September 2026');
    await expect(studio.staleWarning).toHaveCount(0);
    await expect(studio.pricingStatus).toHaveCount(0);
  });

  test('warns in a status region when the prices are stale', async ({ page }) => {
    // Given a studio whose prices were last verified 225 days ago
    await givenStudio(page, OSSINGTON_BLACKBOX);
    const studio = new StudioPage(page);
    await studio.todayIs('2026-10-13');
    // When the visitor opens its page
    await studio.open('ossington-blackbox');
    // Then the pricing block warns that the prices may be out of date
    await expect(studio.staleWarning).toContainText(
      'We last checked these prices 225 days ago. Confirm with the studio before you book.',
    );
    await expect(studio.allInCost).toContainText(
      'All-in for a standard 2-hour shoot: 3 hours at $90.00.',
    );
  });

  test('shows the not-found page for a studio that is not published', async ({ page }) => {
    // Given no published studio has the slug
    await givenNoStudio(page, 'corktown-garage-studio');
    const studio = new StudioPage(page);
    // When the visitor opens it
    await studio.open('corktown-garage-studio');
    // Then the not-found page shows
    await expect(studio.notFoundHeading).toBeVisible();
    await expect.poll(() => studio.title()).toBe('Page not found · ShotThere');
  });

  test('fits a phone without horizontal scrolling', async ({ page }) => {
    // Given a published studio and a 320px-wide window
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.usePhoneWidth();
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    await expect(studio.heading).toBeVisible();
    // Then nothing overflows sideways
    expect(await studio.hasHorizontalScroll()).toBe(false);
  });
});
