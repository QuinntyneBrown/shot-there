import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ButtonComponent,
  IconComponent,
  StatGridComponent,
  StatTileComponent,
} from '@shot-there/components';

import descriptionMd from './StatTileDescription.md';
import bestPracticesMd from './StatTileBestPractices.md';

export { Default } from './StatTileDefault.stories';
export { WithoutLink } from './StatTileWithoutLink.stories';
export { ZeroCounts } from './StatTileZeroCounts.stories';

export default {
  title: 'Components/Stat Tile',
  component: StatTileComponent,
  decorators: [
    moduleMetadata({
      imports: [StatTileComponent, StatGridComponent, ButtonComponent, IconComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<StatTileComponent>;
