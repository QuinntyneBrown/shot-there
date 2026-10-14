import type { StoryObj } from '@storybook/angular';

import type { IconButtonComponent } from '@shot-there/components';

export const Default: StoryObj<IconButtonComponent> = {
  args: {
    icon: 'close',
    label: 'Close',
    outline: false,
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['close', 'chevron-left', 'chevron-right', 'map-pin', 'list', 'home', 'trash'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <button st-icon-button type="button" [icon]="icon" [label]="label" [outline]="outline"></button>
    `,
  }),
};
