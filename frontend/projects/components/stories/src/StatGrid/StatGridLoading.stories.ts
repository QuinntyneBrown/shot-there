import type { StoryObj } from '@storybook/angular';

import type { StatGridComponent } from '@shot-there/components';

export const Loading: StoryObj<StatGridComponent> = {
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
          'While the dashboard loads the grid holds three skeleton tiles inside an `aria-busy` wrapper with a hidden status message.',
      },
    },
  },
};
