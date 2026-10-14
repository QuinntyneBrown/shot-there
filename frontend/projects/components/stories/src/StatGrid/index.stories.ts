import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ButtonComponent,
  IconComponent,
  StatGridComponent,
  StatTileComponent,
  StatTileSkeletonComponent,
} from '@shot-there/components';

import descriptionMd from './StatGridDescription.md';
import bestPracticesMd from './StatGridBestPractices.md';

export { Default } from './StatGridDefault.stories';
export { Loading } from './StatGridLoading.stories';

export default {
  title: 'Components/Stat Grid',
  component: StatGridComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StatGridComponent,
        StatTileComponent,
        StatTileSkeletonComponent,
        ButtonComponent,
        IconComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<StatGridComponent>;
