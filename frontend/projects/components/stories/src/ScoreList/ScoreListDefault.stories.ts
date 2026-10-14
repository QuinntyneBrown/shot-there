import type { StoryObj } from '@storybook/angular';

import type { ScoreListComponent } from '@shot-there/components';

export const Default: StoryObj<ScoreListComponent> = {
  args: {
    label: 'Rubric scores',
    max: 5,
    scores: [
      { label: 'Value', value: 4 },
      { label: 'Light', value: 5 },
      { label: 'Space', value: 3 },
      { label: 'Gear', value: 4 },
      { label: 'Logistics', value: 2 },
      { label: 'Condition', value: 5 },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<st-score-list [label]="label" [scores]="scores" [max]="max" />`,
  }),
};
