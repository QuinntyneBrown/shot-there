import type { StoryObj } from '@storybook/angular';

import type { SelectComponent } from '@shot-there/components';

export const Default: StoryObj<SelectComponent> = {
  args: {
    label: 'Window direction',
    options: [
      { value: '', label: 'Not set' },
      { value: 'none', label: 'No windows' },
      { value: 'north', label: 'North' },
      { value: 'east', label: 'East' },
      { value: 'south', label: 'South' },
      { value: 'west', label: 'West' },
    ],
    size: 'md',
    help: 'The side the largest windows face.',
    error: null,
    warning: null,
    optional: false,
    inline: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-select
        style="max-width: 360px"
        [label]="label"
        [options]="options"
        [size]="size"
        [help]="help"
        [error]="error"
        [warning]="warning"
        [optional]="optional"
        [inline]="inline"
      />
    `,
  }),
};
