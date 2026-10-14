import type { StoryObj } from '@storybook/angular';

import type { RadioGroupComponent } from '@shot-there/components';

export const Invalid: StoryObj<RadioGroupComponent> = {
  render: () => ({
    props: {
      options: [
        { value: 'paid_in_full', label: 'I paid the full rate' },
        { value: 'discounted', label: 'Discounted' },
        { value: 'comped', label: 'Comped (free of charge)' },
      ],
    },
    template: `
      <st-radio-group
        label="How was this session paid for?"
        [options]="options"
        error="Choose how this session was paid for"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing chosen and saved: the group `error` shows under the legend and marks every radio invalid.',
      },
    },
  },
};
