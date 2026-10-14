import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ScoreListComponent } from '@shot-there/components';

import descriptionMd from './ScoreListDescription.md';
import bestPracticesMd from './ScoreListBestPractices.md';

export { Default } from './ScoreListDefault.stories';
export { LowestAndHighest } from './ScoreListLowestAndHighest.stories';

export default {
  title: 'Components/Score List',
  component: ScoreListComponent,
  decorators: [moduleMetadata({ imports: [ScoreListComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ScoreListComponent>;
