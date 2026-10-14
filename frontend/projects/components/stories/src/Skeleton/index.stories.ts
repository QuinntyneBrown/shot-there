import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SkeletonComponent } from '@shot-there/components';

import descriptionMd from './SkeletonDescription.md';
import bestPracticesMd from './SkeletonBestPractices.md';

export { Default } from './SkeletonDefault.stories';
export { Shape } from './SkeletonShape.stories';
export { LoadingCard } from './SkeletonLoadingCard.stories';

export default {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  decorators: [moduleMetadata({ imports: [SkeletonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SkeletonComponent>;
