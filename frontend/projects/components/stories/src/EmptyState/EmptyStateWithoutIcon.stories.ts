import type { StoryObj } from '@storybook/angular';

import type { EmptyStateComponent } from '@shot-there/components';

export const WithoutIcon: StoryObj<EmptyStateComponent> = {
  render: () => ({
    template: `
      <st-empty-state
        compact
        [headingLevel]="3"
        title="Studio reviews are coming"
        text="When we've shot in studios nearby, the closest three will show here."
      >
        <a st-button slot="actions" href="#/studios">Browse studios</a>
      </st-empty-state>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'With no `icon`, the block is just a heading, text and action — for a small section such as Rain backup.',
      },
    },
  },
};
