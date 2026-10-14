import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ProgressComponent } from '@shot-there/components';

import descriptionMd from './ProgressDescription.md';
import bestPracticesMd from './ProgressBestPractices.md';

export { Default } from './ProgressDefault.stories';
export { Determinate } from './ProgressDeterminate.stories';
export { Indeterminate } from './ProgressIndeterminate.stories';
export { Tone } from './ProgressTone.stories';

export default {
  title: 'Components/Progress',
  component: ProgressComponent,
  decorators: [moduleMetadata({ imports: [ProgressComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ProgressComponent>;
