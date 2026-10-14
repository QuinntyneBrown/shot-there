import { Locator, Page } from '@playwright/test';
import { DescriptionListComponent } from './description-list.component';

/** An st-price-block: the .price-block with its all-in figure, facts, verified line and projected notice. */
export class PriceBlockComponent {
  readonly root: Locator;
  readonly facts: DescriptionListComponent;

  constructor(scope: Page | Locator) {
    this.root = scope.locator('.price-block');
    this.facts = new DescriptionListComponent(this.root);
  }

  allIn(): Locator {
    return this.root.locator('.price-block__allin strong');
  }

  allInText(): Locator {
    return this.root.locator('.price-block__allin span');
  }

  verified(): Locator {
    return this.root.locator('.price-block__verified');
  }

  verifiedDate(): Locator {
    return this.verified().locator('time');
  }

  /** Whether the given locators sit one above the next, top to bottom. */
  async isStackedInOrder(...parts: Locator[]): Promise<boolean> {
    const tops = await Promise.all(parts.map(async (part) => (await part.boundingBox())?.y ?? -1));
    return tops.every((top, i) => i === 0 || top > tops[i - 1]);
  }
}
