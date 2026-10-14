import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SpinnerComponent } from '@shot-there/components';

import descriptionMd from './SpinnerDescription.md';
import bestPracticesMd from './SpinnerBestPractices.md';

export { Default } from './SpinnerDefault.stories';
export { Size } from './SpinnerSize.stories';
export { InStatus } from './SpinnerInStatus.stories';

export default {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  decorators: [moduleMetadata({ imports: [SpinnerComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SpinnerComponent>;
