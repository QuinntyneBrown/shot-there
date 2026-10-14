import type { StoryObj } from '@storybook/angular';

import type { EmptyStateComponent } from '@shot-there/components';

export const Compact: StoryObj<EmptyStateComponent> = {
  render: () => ({
    template: `
      <st-empty-state
        compact
        tone="success"
        icon="success"
        [headingLevel]="3"
        title="Everything is up to date"
        text="No prices or permits are older than 153 days."
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`compact` tightens the padding for a section, here a success state with no action.',
      },
    },
  },
};
