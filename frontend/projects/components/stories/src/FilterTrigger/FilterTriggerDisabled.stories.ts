import type { StoryObj } from '@storybook/angular';

import type { FilterTriggerComponent } from '@shot-there/components';

export const Disabled: StoryObj<FilterTriggerComponent> = {
  render: () => ({
    template: `
      <button st-filter-trigger type="button" aria-expanded="false" disabled>Filters</button>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Native `disabled` dims the pill to half opacity.' },
    },
  },
};
