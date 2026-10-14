import type { StoryObj } from '@storybook/angular';

import type { SpinnerComponent } from '@shot-there/components';

export const Default: StoryObj<SpinnerComponent> = {
  args: {
    size: 'md',
    label: 'Loading studios…',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<st-spinner [size]="size" [label]="label" />`,
  }),
};
