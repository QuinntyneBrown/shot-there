import type { StoryObj } from '@storybook/angular';

import type { FilterTriggerComponent } from '@shot-there/components';

export const Default: StoryObj<FilterTriggerComponent & { label: string }> = {
  args: {
    label: 'Filters',
    count: 0,
  },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 12 } },
  },
  render: (args) => ({
    props: args,
    template: `
      <button st-filter-trigger type="button" aria-expanded="false" [count]="count">{{ label }}</button>
    `,
  }),
};
