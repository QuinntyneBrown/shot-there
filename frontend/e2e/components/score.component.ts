import { Locator, Page } from '@playwright/test';

/** The score parts: st-score-overall (.score-overall), st-score-list (.score-list) and st-light-rating (.light-rating). */
export class ScoreComponent {
  readonly overall: Locator;
  readonly list: Locator;

  constructor(private readonly scope: Page | Locator) {
    this.overall = scope.locator('.score-overall');
    this.list = scope.getByRole('list', { name: 'Rubric scores', exact: true });
  }

  /** The rows spoken text, in order ("Value: 4 out of 5"). */
  spokenRows(): Promise<string[]> {
    return this.list.locator('.score > .visually-hidden').allInnerTexts();
  }

  /** The number of filled pips in the nth row. */
  filledPips(rowIndex: number): Promise<number> {
    return this.list.locator('.score').nth(rowIndex).locator('.pips > i[data-on]').count();
  }

  pipsInRow(rowIndex: number): Promise<number> {
    return this.list.locator('.score').nth(rowIndex).locator('.pips > i').count();
  }

  /** A light rating by its word. */
  lightRating(word: string): Locator {
    return this.scope.locator('.light-rating', { hasText: word });
  }

  async lightPips(word: string): Promise<{ filled: number; total: number }> {
    const rating = this.lightRating(word);
    return {
      filled: await rating.locator('.pips > i[data-on]').count(),
      total: await rating.locator('.pips > i').count(),
    };
  }
}
