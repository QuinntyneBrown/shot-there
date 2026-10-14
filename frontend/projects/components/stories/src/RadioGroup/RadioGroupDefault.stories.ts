import type { StoryObj } from '@storybook/angular';

import type { RadioGroupComponent } from '@shot-there/components';

export const Default: StoryObj<RadioGroupComponent> = {
  args: {
    label: 'How was this session paid for?',
    options: [
      { value: 'paid_in_full', label: 'I paid the full rate' },
      { value: 'discounted', label: 'Discounted' },
      { value: 'comped', label: 'Comped (free of charge)' },
    ],
    appearance: 'form',
    help: null,
    error: null,
    optional: false,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['form', 'filter'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-radio-group
        [label]="label"
        [options]="options"
        [appearance]="appearance"
        [help]="help"
        [error]="error"
        [optional]="optional"
      />
    `,
  }),
};
