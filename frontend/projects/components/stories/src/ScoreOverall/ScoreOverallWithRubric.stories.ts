import type { StoryObj } from '@storybook/angular';

import type { ScoreOverallComponent } from '@shot-there/components';

export const WithRubric: StoryObj<ScoreOverallComponent> = {
  render: () => ({
    props: {
      scores: [
        { label: 'Value', value: 4 },
        { label: 'Light', value: 5 },
        { label: 'Space', value: 3 },
        { label: 'Gear', value: 4 },
        { label: 'Logistics', value: 2 },
        { label: 'Condition', value: 5 },
      ],
    },
    template: `
      <section aria-labelledby="verdict" class="stack">
        <h2 id="verdict">Verdict</h2>
        <st-score-overall value="3.8" maxText="overall, out of 5" />
        <st-score-list label="Rubric scores" [scores]="scores" />
      </section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'In a review the overall score heads the verdict, above the six rubric rows.',
      },
    },
  },
};
