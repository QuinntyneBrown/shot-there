import type { StoryObj } from '@storybook/angular';

import type { FilterTriggerComponent } from '@shot-there/components';

export const WithCount: StoryObj<FilterTriggerComponent> = {
  render: () => ({
    template: `
      <button st-filter-trigger type="button" aria-expanded="false" count="2">Filters</button>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Above 0 the count shows in a bubble and the name reads "Filters, 2 active".',
      },
    },
  },
};
