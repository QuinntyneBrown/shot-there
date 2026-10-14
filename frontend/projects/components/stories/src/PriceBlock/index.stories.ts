import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AlertComponent, PriceBlockComponent } from '@shot-there/components';

import descriptionMd from './PriceBlockDescription.md';
import bestPracticesMd from './PriceBlockBestPractices.md';

export { Default } from './PriceBlockDefault.stories';
export { NoFees } from './PriceBlockNoFees.stories';
export { Stale } from './PriceBlockStale.stories';

export default {
  title: 'Components/Price Block',
  component: PriceBlockComponent,
  decorators: [moduleMetadata({ imports: [PriceBlockComponent, AlertComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<PriceBlockComponent>;
