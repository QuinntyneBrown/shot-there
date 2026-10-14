import type { StoryObj } from '@storybook/angular';

import type { StatTileSkeletonComponent } from '@shot-there/components';

export const Default: StoryObj<StatTileSkeletonComponent> = {
  render: () => ({
    template: `
      <ul st-stat-grid>
        <li st-stat-tile-skeleton></li>
      </ul>
    `,
  }),
};
