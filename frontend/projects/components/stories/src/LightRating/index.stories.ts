import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { LightRatingComponent } from '@shot-there/components';

import descriptionMd from './LightRatingDescription.md';
import bestPracticesMd from './LightRatingBestPractices.md';

export { Default } from './LightRatingDefault.stories';
export { Levels } from './LightRatingLevels.stories';
export { TimesOfDay } from './LightRatingTimesOfDay.stories';

export default {
  title: 'Components/Light Rating',
  component: LightRatingComponent,
  decorators: [moduleMetadata({ imports: [LightRatingComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<LightRatingComponent>;
