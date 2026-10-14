import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StatusComponent } from '@shot-there/components';

import descriptionMd from './StatusDescription.md';
import bestPracticesMd from './StatusBestPractices.md';

export { Default } from './StatusDefault.stories';
export { Variant } from './StatusVariant.stories';
export { WithContext } from './StatusWithContext.stories';

export default {
  title: 'Components/Status',
  component: StatusComponent,
  decorators: [moduleMetadata({ imports: [StatusComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<StatusComponent>;
