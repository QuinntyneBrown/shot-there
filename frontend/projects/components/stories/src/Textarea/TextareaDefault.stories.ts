import type { StoryObj } from '@storybook/angular';

import type { TextareaComponent } from '@shot-there/components';

export const Default: StoryObj<TextareaComponent> = {
  args: {
    label: "Who it's for",
    rows: 3,
    maxlength: null,
    help: 'Visitors read this first.',
    error: null,
    warning: null,
    optional: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <st-textarea
        style="max-width: 480px"
        [label]="label"
        [rows]="rows"
        [maxlength]="maxlength"
        [help]="help"
        [error]="error"
        [warning]="warning"
        [optional]="optional"
      />
    `,
  }),
};
