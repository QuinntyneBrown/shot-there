import type { StoryObj } from '@storybook/angular';

import type { ScoreListComponent } from '@shot-there/components';

export const LowestAndHighest: StoryObj<ScoreListComponent> = {
  render: () => ({
    props: {
      scores: [
        { label: 'Value', value: 5 },
        { label: 'Light', value: 1 },
        { label: 'Space', value: 2 },
        { label: 'Gear', value: 1 },
        { label: 'Logistics', value: 5 },
        { label: 'Condition', value: 3 },
      ],
    },
    template: `<st-score-list label="Rubric scores" [scores]="scores" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A score of 1 fills one pip and a score of 5 fills all five; the number always follows.',
      },
    },
  },
};
