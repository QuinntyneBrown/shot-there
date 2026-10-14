import type { StoryObj } from '@storybook/angular';

import type { StatTileSkeletonComponent } from '@shot-there/components';

export const LoadingDashboard: StoryObj<StatTileSkeletonComponent> = {
  render: () => ({
    template: `
      <div aria-busy="true">
        <p class="visually-hidden" role="status">Loading the dashboard</p>
        <ul st-stat-grid>
          <li st-stat-tile-skeleton></li>
          <li st-stat-tile-skeleton></li>
          <li st-stat-tile-skeleton></li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Three skeletons stand in for Studios, Spots and Guides while the dashboard loads; the hidden status message is what assistive technology hears.',
      },
    },
  },
};
