import { expect, test } from '@playwright/test';
import { ScoreComponent } from '../components/score.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Score components (ICD-002 §9.5, CRD score)', () => {
  test('score-overall shows the value and its max text', async ({ page }) => {
    // Given the overall score 3.8
    const harness = new HarnessPage(page);
    await harness.open('score/default');
    const score = new ScoreComponent(page);
    // Then the value and the max text read in order
    await expect(score.overall.locator('.score-overall__value')).toHaveText('3.8');
    await expect(score.overall.locator('.score-overall__max')).toHaveText('overall, out of 5');
    expect(harness.errors).toEqual([]);
  });

  test('score-list is a named list of rows with pips, each spoken as "label: value out of max"', async ({
    page,
  }) => {
    // Given the rubric scores
    const harness = new HarnessPage(page);
    await harness.open('score/default');
    const score = new ScoreComponent(page);
    // Then each row speaks its label, value and max, and the pips are hidden from assistive technology
    expect(await score.spokenRows()).toEqual([
      'Value: 4 out of 5',
      'Light: 5 out of 5',
      'Space: 3 out of 5',
      'Gear: 4 out of 5',
      'Logistics: 2 out of 5',
      'Condition: 5 out of 5',
    ]);
    await expect(score.list.locator('.pips').first()).toHaveAttribute('aria-hidden', 'true');
    // And the first row has five pips of which four are filled
    expect(await score.pipsInRow(0)).toBe(5);
    expect(await score.filledPips(0)).toBe(4);
    expect(await score.filledPips(4)).toBe(2);
  });

  test('light-rating fills 0 to 3 pips by level and shows the word', async ({ page }) => {
    // Given light ratings at none, medium and strong
    const harness = new HarnessPage(page);
    await harness.open('score/default');
    const score = new ScoreComponent(page);
    // Then each has three pips with 0, 2 and 3 filled
    expect(await score.lightPips('None')).toEqual({ filled: 0, total: 3 });
    expect(await score.lightPips('Medium')).toEqual({ filled: 2, total: 3 });
    expect(await score.lightPips('Strong')).toEqual({ filled: 3, total: 3 });
    await expect(score.lightRating('Medium').locator('.pips')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('score/default', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
