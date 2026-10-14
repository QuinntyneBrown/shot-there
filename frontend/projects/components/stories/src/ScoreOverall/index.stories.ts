import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ScoreListComponent, ScoreOverallComponent } from '@shot-there/components';

import descriptionMd from './ScoreOverallDescription.md';
import bestPracticesMd from './ScoreOverallBestPractices.md';

export { Default } from './ScoreOverallDefault.stories';
export { WithRubric } from './ScoreOverallWithRubric.stories';

export default {
  title: 'Components/Score Overall',
  component: ScoreOverallComponent,
  decorators: [moduleMetadata({ imports: [ScoreOverallComponent, ScoreListComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ScoreOverallComponent>;
