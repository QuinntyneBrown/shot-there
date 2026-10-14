import type { StoryObj } from '@storybook/angular';

import type { TextFieldComponent } from '@shot-there/components';

export const Default: StoryObj<TextFieldComponent> = {
  args: {
    label: 'Studio name',
    type: 'text',
    size: 'md',
    help: 'Shown on the card and the review page.',
    error: null,
    warning: null,
    optional: false,
    prefix: null,
    readonly: false,
    inline: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-text-field
        [label]="label"
        [type]="type"
        [size]="size"
        [help]="help"
        [error]="error"
        [warning]="warning"
        [optional]="optional"
        [prefix]="prefix"
        [readonly]="readonly"
        [inline]="inline"
      />
    `,
  }),
};
