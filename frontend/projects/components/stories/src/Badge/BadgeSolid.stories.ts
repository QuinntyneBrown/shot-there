import type { StoryObj } from '@storybook/angular';

import type { BadgeComponent } from '@shot-there/components';

export const Solid: StoryObj<BadgeComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <st-badge solid>Neutral</st-badge>
        <st-badge tone="info" solid>Due soon</st-badge>
        <st-badge tone="success" solid>Lowest</st-badge>
        <st-badge tone="warning" solid>Stale</st-badge>
        <st-badge tone="danger" solid>Removed</st-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`solid` fills the pill with the tone colour for stronger emphasis.',
      },
    },
  },
};
