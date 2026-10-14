import type { StoryObj } from '@storybook/angular';

import type { ScoreOverallComponent } from '@shot-there/components';

export const Default: StoryObj<ScoreOverallComponent> = {
  args: {
    value: '3.8',
    maxText: 'overall, out of 5',
  },
  render: (args) => ({
    props: args,
    template: `<st-score-overall [value]="value" [maxText]="maxText" />`,
  }),
};
