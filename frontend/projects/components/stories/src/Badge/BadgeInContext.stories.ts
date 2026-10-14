import type { StoryObj } from '@storybook/angular';

import type { BadgeComponent } from '@shot-there/components';

export const InContext: StoryObj<BadgeComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <p class="cluster">Cleaning fee $25.00 <st-badge>Mandatory</st-badge></p>
        <p class="cluster">All-in, 2 hours $80.00 <st-badge tone="success">Lowest</st-badge></p>
        <p class="cluster">Ossington Blackbox <st-badge tone="warning">Prices may be out of date</st-badge></p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A badge reads in place with what it qualifies: "$25.00 Mandatory", "$80.00 Lowest".',
      },
    },
  },
};
