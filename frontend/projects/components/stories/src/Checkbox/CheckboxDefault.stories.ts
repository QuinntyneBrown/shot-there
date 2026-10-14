import type { StoryObj } from '@storybook/angular';

import type { CheckboxComponent } from '@shot-there/components';

export const Default: StoryObj<CheckboxComponent> = {
  args: {
    label: '20 A circuits available',
    description: null,
    help: 'Needed for strobes.',
    error: null,
    warning: null,
    optional: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <st-checkbox
        [label]="label"
        [description]="description"
        [help]="help"
        [error]="error"
        [warning]="warning"
        [optional]="optional"
      />
    `,
  }),
};
