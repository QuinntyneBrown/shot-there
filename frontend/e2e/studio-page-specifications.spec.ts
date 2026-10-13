import { givenStudio } from './fakes/fake-studios-api';
import { BLOORDALE_SUN_STUDIO, THE_JUNCTION_LOFT } from './fakes/studio-details';
import { expect, test } from './fakes/test';
import { StudioPage } from './pages/studio.page';

test.describe('Studio page: specifications, gear and logistics', () => {
  test('shows the measured specifications in metres and feet', async ({ page }) => {
    // Given a studio 6.1 m × 4.3 m with a scuffed cyc wall
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then the specifications show each measurement
    const specs = studio.specifications;
    await expect(studio.row(specs, 'Usable shooting space')).toHaveText('6.1 m × 4.3 m (20 ft × 14 ft)');
    await expect(studio.row(specs, 'Ceiling height')).toHaveText('4.0 m (13 ft)');
    await expect(studio.row(specs, 'Window direction')).toHaveText('North');
    await expect(studio.row(specs, 'Power')).toHaveText('8 outlets, standard 15 A · 20 A circuits: Yes');
    await expect(studio.row(specs, 'Cyc wall')).toHaveText('Yes · scuffed');
    await expect(studio.row(specs, 'Backdrops')).toHaveText('White, grey and black seamless, 2.7 m');
  });

  test('rates natural light for all four times of day, stacked on a phone and in a row from MD', async ({ page }) => {
    // Given a published studio
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.useWidth(320);
    // When the visitor opens its page on a phone
    await studio.open('the-junction-loft');
    // Then each time of day has a rating, one per row
    await expect(studio.lightRatings).toHaveText(['Morning Medium', 'Midday Strong', 'Afternoon Strong', 'Evening Low']);
    expect(await studio.lightRatingRowCount()).toBe(4);
    // When the window is MD wide
    await studio.useWidth(800);
    // Then the four ratings share one row
    await expect.poll(() => studio.lightRatingRowCount()).toBe(1);
  });

  test('lists included gear by category, with quantities, apart from priced extras', async ({ page }) => {
    // Given a studio with included lights and two paid extras
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then included gear is grouped by category and extras show their price
    const gear = studio.gear;
    await expect(studio.row(gear, 'Lights')).toHaveText('Godox AD600 strobe × 2 · 60 cm LED panel × 1');
    await expect(studio.row(gear, 'Stands')).toHaveText('C-stand × 4');
    await expect(studio.row(gear, 'Other')).toHaveText('Garment steamer');
    await expect(studio.row(gear, 'Hazer')).toHaveText('$20.00');
    await expect(studio.row(gear, 'Extra seamless roll')).toHaveText('$15.00');
  });

  test('shows load-in with its note and every logistics row', async ({ page }) => {
    // Given a studio reached by a small freight elevator
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then the logistics rows show
    const logistics = studio.logistics;
    await expect(studio.row(logistics, 'Load-in')).toHaveText('Freight elevator · small, 1.2 m wide');
    await expect(studio.row(logistics, 'Parking')).toHaveText('Street, paid, 2-hour limit on Dundas');
    await expect(studio.row(logistics, 'Washroom')).toHaveText('Private, in the studio');
    await expect(studio.row(logistics, 'Changing area')).toHaveText('Curtained corner with a mirror');
    await expect(studio.row(logistics, 'Client seating')).toHaveText('Sofa for 4');
    await expect(studio.row(logistics, 'Noise')).toContainText('Streetcar rumble');
  });

  test('puts each logistics label above its value on a phone and beside it from MD', async ({ page }) => {
    // Given a published studio on a phone
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.useWidth(320);
    await studio.open('the-junction-loft');
    // Then the label sits above the value
    await expect(studio.row(studio.logistics, 'Transit')).toBeVisible();
    expect(await studio.rowLayout(studio.logistics, 'Transit')).toBe('stacked');
    // When the window is MD wide
    await studio.useWidth(800);
    // Then the label sits beside the value
    await expect.poll(() => studio.rowLayout(studio.logistics, 'Transit')).toBe('side-by-side');
  });

  test('says "No" for a missing cyc wall, "None" for no changing area, and that nothing costs extra', async ({ page }) => {
    // Given a studio with no cyc wall, no changing area and no paid extras
    await givenStudio(page, BLOORDALE_SUN_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('bloordale-sun-studio');
    // Then those rows say so rather than disappearing
    await expect(studio.row(studio.specifications, 'Cyc wall')).toHaveText('No');
    await expect(studio.row(studio.logistics, 'Changing area')).toHaveText('None');
    await expect(studio.gear).toContainText('Nothing costs extra at this studio.');
    await expect(studio.row(studio.specifications, 'Power')).toHaveText('10 outlets, standard 15 A · 20 A circuits: No');
  });
});
