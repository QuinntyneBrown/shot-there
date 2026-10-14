import type { StoryObj } from '@storybook/angular';

import type { CheckboxGroupComponent } from '@shot-there/components';

export const Default: StoryObj<CheckboxGroupComponent> = {
  args: {
    label: 'Best for',
    options: [
      { value: 'engagement', label: 'Engagement' },
      { value: 'family', label: 'Family' },
      { value: 'portrait', label: 'Portrait' },
      { value: 'brand', label: 'Brand' },
      { value: 'video', label: 'Video' },
    ],
    appearance: 'form',
    help: 'Choose at least one before publishing.',
    error: null,
    optional: false,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['form', 'filter'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-checkbox-group
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
