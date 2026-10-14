import type { StoryObj } from '@storybook/angular';

import type { EmptyStateComponent } from '@shot-there/components';

export const NoResults: StoryObj<EmptyStateComponent> = {
  render: () => ({
    template: `
      <st-empty-state
        icon="search"
        [headingLevel]="3"
        title="No studios match these filters"
        text="Try removing a filter, or clear them all to see all 7 studios."
      >
        <button st-button slot="actions" type="button">Clear filters</button>
      </st-empty-state>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Filters that match nothing: an `h3` under the results heading and one action to clear them.',
      },
    },
  },
};
