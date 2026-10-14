import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, ResultCountComponent } from '@shot-there/components';

import descriptionMd from './ResultCountDescription.md';
import bestPracticesMd from './ResultCountBestPractices.md';

export { Default } from './ResultCountDefault.stories';
export { SortSuffix } from './ResultCountSortSuffix.stories';
export { Live } from './ResultCountLive.stories';
export { VisuallyHidden } from './ResultCountVisuallyHidden.stories';

export default {
  title: 'Components/Result Count',
  component: ResultCountComponent,
  decorators: [moduleMetadata({ imports: [ResultCountComponent, ButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ResultCountComponent>;
