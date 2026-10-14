import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StatGridComponent, StatTileSkeletonComponent } from '@shot-there/components';

import descriptionMd from './StatTileSkeletonDescription.md';
import bestPracticesMd from './StatTileSkeletonBestPractices.md';

export { Default } from './StatTileSkeletonDefault.stories';
export { LoadingDashboard } from './StatTileSkeletonLoadingDashboard.stories';

export default {
  title: 'Components/Stat Tile Skeleton',
  component: StatTileSkeletonComponent,
  decorators: [moduleMetadata({ imports: [StatTileSkeletonComponent, StatGridComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<StatTileSkeletonComponent>;
