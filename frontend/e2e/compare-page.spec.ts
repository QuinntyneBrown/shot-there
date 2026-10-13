import { JUNCTION, LESLIEVILLE, LIBERTY, OSSINGTON, comparisonOf } from './fakes/comparisons';
import { givenComparison } from './fakes/fake-compare-api';
import { expect, test } from './fakes/test';
import { ComparePage } from './pages/compare.page';

const THREE = '?studios=the-junction-loft,leslieville-daylight-studio,ossington-blackbox';

test.describe('Comparison page', () => {
  test('compares the studios in the URL, in that order, in aligned rows', async ({ page }) => {
    // Given three published studios in a comparison URL
    const requested = await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE, OSSINGTON]));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open(THREE);
    // Then the studios are compared in the URL's order, each row holding one value per studio
    await expect(compare.heading).toHaveText('Compare 3 studios');
    expect(requested.at(-1)).toBe('the-junction-loft,leslieville-daylight-studio,ossington-blackbox');
    expect(await compare.columnHeaders()).toEqual(['The Junction Loft', 'Leslieville Daylight Studio', 'Ossington Blackbox']);
    await expect(compare.rowCells('Hourly rate')).toHaveText(['$60.00', '$45.50', '$90.00']);
    await expect(compare.rowCells('Minimum booking')).toHaveText(['2 hours', '2 hours', '3 hours']);
    await expect(compare.rowCells('Usable space')).toHaveText(['6.1 m × 4.3 m', '6.4 m × 4.9 m', '6.1 m × 4.3 m']);
    await expect(compare.rowCells('Cyc wall')).toHaveText(['Yes · scuffed', 'No', 'Yes · scuffed']);
    await expect(compare.rowCells('Light')).toHaveText(['5 / 5 out of 5', '5 / 5 out of 5', '2 / 5 out of 5']);
    await expect(compare.rowCells('Overall')).toHaveText(['3.8 / 5 out of 5', '4.0 / 5 out of 5', '3.8 / 5 out of 5']);
    await expect(compare.rowCells('Prices verified')).toHaveText(['22 Sep 2026', '10 Aug 2026', '2 Mar 2026']);
    // And the test shots sit side by side, shot for shot
    const firstShots = compare.rowCells('Shot 1 · Headshot').getByRole('img');
    await expect(firstShots).toHaveCount(3);
    await expect(firstShots.nth(1)).toHaveAttribute('alt', 'Leslieville Daylight Studio, test shot 1, headshot.');
    await expect.poll(() => compare.title()).toBe('Compare The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox · ShotThere');
  });

  test('marks the lowest all-in cost, flags stale prices and fills gaps with a dash', async ({ page }) => {
    // Given a comparison where Leslieville is cheapest, Ossington's prices are stale and some values are missing
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE, OSSINGTON]));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open(THREE);
    // Then the cheapest says "Lowest", the stale one says so, and missing values show "—"
    await expect(compare.rowCells('All-in, 2 hours')).toHaveText(['$145.00', '$91.00 Lowest', '$270.00 Prices may be out of date']);
    await expect(compare.rowCells('Mandatory fees')).toHaveText(['Cleaning $25.00', '—', '—']);
    await expect(compare.rowCells('Parking')).toHaveText(['Street, paid', '—', 'Street, paid']);
    await expect(compare.rowCells('Load-in')).toHaveText(['Freight elevator, small', 'Stairs', 'Freight elevator, small']);
  });

  test('explains when a studio in the link could not be found', async ({ page }) => {
    // Given a link with one unknown slug and two valid ones
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE], { notFoundSlugs: ['nowhere-studio'] }));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open('?studios=the-junction-loft,nowhere-studio,leslieville-daylight-studio');
    // Then the two are compared with a message about the missing one
    await expect(compare.heading).toHaveText('Compare 2 studios');
    await expect(compare.notice).toHaveText("One studio in this link couldn't be found, so we're comparing the other two.");
  });

  test('compares only the first four and says why', async ({ page }) => {
    // Given a link with more than four studios
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE, OSSINGTON, LIBERTY], { truncated: true }));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open('?studios=the-junction-loft,leslieville-daylight-studio,ossington-blackbox,liberty-cyc-house,riverside-rooftop-studio');
    // Then four are compared with a message stating the limit
    await expect(compare.heading).toHaveText('Compare 4 studios');
    await expect(compare.notice).toHaveText("You can compare up to 4 studios. We're showing the first 4 from this link.");
  });

  test('asks for at least two studios when the link has fewer', async ({ page }) => {
    // Given a link with only one valid studio
    await givenComparison(page, comparisonOf([JUNCTION]));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open('?studios=the-junction-loft');
    // Then no table shows; the page asks for two and links to the studio list
    await expect(compare.needTwo).toBeVisible();
    await expect(compare.browseStudiosLink).toHaveAttribute('href', '/studios');
    await expect(compare.table).toHaveCount(0);
  });

  test('asks for studios when the link names none, without calling the API', async ({ page }) => {
    // Given the compare page with no studios in the URL
    const requested = await givenComparison(page, comparisonOf([]));
    const compare = new ComparePage(page);
    // When the visitor opens it
    await compare.open('');
    // Then it asks for two studios
    await expect(compare.needTwo).toBeVisible();
    expect(requested).toHaveLength(0);
  });

  test('copies the comparison link and confirms it', async ({ page }) => {
    // Given a comparison
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE]));
    const compare = new ComparePage(page);
    await compare.allowClipboard();
    await compare.open('?studios=the-junction-loft,leslieville-daylight-studio');
    // When the visitor activates Copy link
    await compare.copyLinkButton.click();
    // Then the page URL is on the clipboard and the copy is announced
    await expect.poll(() => compare.clipboardText()).toBe(compare.currentUrl());
    await expect(compare.announcer).toHaveText('Link copied');
  });

  test('scrolls the table, not the page, on a phone, keeping the row labels in view', async ({ page }) => {
    // Given three studios compared on a phone
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE, OSSINGTON]));
    const compare = new ComparePage(page);
    await compare.useWidth(320);
    await compare.open(THREE);
    await expect(compare.table).toBeVisible();
    // Then the table scrolls sideways inside itself, the page does not, and each studio column is at least 160px
    expect(await compare.hasPageHorizontalScroll()).toBe(false);
    expect(await compare.tableScrollsSideways()).toBe(true);
    expect(await compare.narrowestStudioColumn()).toBeGreaterThanOrEqual(160);
    // When the table is scrolled to its last column
    const before = (await compare.rowHeader('Hourly rate').boundingBox())!.x;
    await compare.scrollTableToEnd();
    // Then the row labels stay where they were
    expect((await compare.rowHeader('Hourly rate').boundingBox())!.x).toBe(before);
  });

  test('fits four studios without scrolling on a large screen', async ({ page }) => {
    // Given four studios compared at LG
    await givenComparison(page, comparisonOf([JUNCTION, LESLIEVILLE, OSSINGTON, LIBERTY]));
    const compare = new ComparePage(page);
    await compare.useWidth(1280);
    await compare.open('?studios=the-junction-loft,leslieville-daylight-studio,ossington-blackbox,liberty-cyc-house');
    await expect(compare.table).toBeVisible();
    // Then the table needs no sideways scrolling
    expect(await compare.tableScrollsSideways()).toBe(false);
  });
});
