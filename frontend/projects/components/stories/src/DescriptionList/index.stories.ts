import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DescriptionListComponent } from '@shot-there/components';

import descriptionMd from './DescriptionListDescription.md';
import bestPracticesMd from './DescriptionListBestPractices.md';

export { Default } from './DescriptionListDefault.stories';
export { Numeric } from './DescriptionListNumeric.stories';
export { HiddenSuffix } from './DescriptionListHiddenSuffix.stories';
export { Empty } from './DescriptionListEmpty.stories';

export default {
  title: 'Components/Description List',
  component: DescriptionListComponent,
  decorators: [moduleMetadata({ imports: [DescriptionListComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<DescriptionListComponent>;
