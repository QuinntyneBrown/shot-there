import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { VideoPosterComponent } from '@shot-there/components';

import descriptionMd from './VideoPosterDescription.md';
import bestPracticesMd from './VideoPosterBestPractices.md';

export { Default } from './VideoPosterDefault.stories';
export { FailedPoster } from './VideoPosterFailedPoster.stories';
export { NoPoster } from './VideoPosterNoPoster.stories';

export default {
  title: 'Components/Video Poster',
  component: VideoPosterComponent,
  decorators: [moduleMetadata({ imports: [VideoPosterComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<VideoPosterComponent>;
