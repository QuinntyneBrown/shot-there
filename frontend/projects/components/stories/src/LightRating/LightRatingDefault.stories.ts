import type { StoryObj } from '@storybook/angular';

import type { LightRatingComponent } from '@shot-there/components';

export const Default: StoryObj<LightRatingComponent> = {
  args: {
    level: 'medium',
    text: 'Medium',
  },
  argTypes: {
    level: { control: 'inline-radio', options: ['none', 'low', 'medium', 'strong'] },
  },
  render: (args) => ({
    props: args,
    template: `<st-light-rating [level]="level" [text]="text" />`,
  }),
};
