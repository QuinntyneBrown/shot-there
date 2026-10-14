import { Locator, Page } from '@playwright/test';

/** A ul[st-stat-grid] of li[st-stat-tile]: the .stat-grid and its .stat-tile items. */
export class StatTileComponent {
  readonly grid: Locator;

  constructor(scope: Page | Locator) {
    this.grid = scope.locator('ul.stat-grid');
  }

  tiles(): Locator {
    return this.grid.locator('li.stat-tile');
  }

  /** The tile named by its title heading. */
  tile(title: string): Locator {
    return this.tiles().filter({
      has: this.grid.page().getByRole('heading', { name: title, exact: true }),
    });
  }

  titleHeading(title: string): Locator {
    return this.grid.getByRole('heading', { name: title, exact: true });
  }

  counts(tile: Locator): Locator {
    return tile.locator('.stat-tile__counts');
  }

  skeletonTiles(): Locator {
    return this.grid.locator('li.stat-tile--skeleton');
  }

  /** The number of grid columns in use. */
  columns(): Promise<number> {
    return this.grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  }
}
