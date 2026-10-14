import type { StoryObj } from '@storybook/angular';

import type { BadgeComponent } from '@shot-there/components';

export const Default: StoryObj<BadgeComponent & { label: string }> = {
  args: {
    label: 'Prices may be out of date',
    tone: 'warning',
    solid: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: (args) => ({
    props: args,
    template: `<st-badge [tone]="tone" [solid]="solid">{{ label }}</st-badge>`,
  }),
};
