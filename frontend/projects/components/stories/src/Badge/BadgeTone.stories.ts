import type { StoryObj } from '@storybook/angular';

import type { BadgeComponent } from '@shot-there/components';

export const Tone: StoryObj<BadgeComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <st-badge>Mandatory</st-badge>
        <st-badge tone="info">Due soon</st-badge>
        <st-badge tone="success">Not required</st-badge>
        <st-badge tone="warning">Permit rules may be out of date</st-badge>
        <st-badge tone="danger">Removed</st-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`neutral` is the default; `info`, `success`, `warning` and `danger` tint the pill.',
      },
    },
  },
};
